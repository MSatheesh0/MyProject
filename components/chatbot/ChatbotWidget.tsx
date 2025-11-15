import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';
import { Login } from './Login';
import { CloseIcon, ChatIcon } from './icons';
import { type ChatMessage, type ContextData, type Chat } from '../../types';
import { initializeChat, sendMessageStream } from '../../services/geminiService';
import { supabase } from '../../services/supabaseClient';
import { parseFile } from '../../services/fileParser';
import { type Session } from '@supabase/supabase-js';

interface ChatbotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ isOpen, onClose }) => {
  const [contextData, setContextData] = useState<ContextData>({ resume: '', linkedIn: '', githubUrl: '' });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I am your Portfolio Assistant. I can answer questions based on the latest resume. Please wait while I fetch the data..." }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchAndSetContext = useCallback(async () => {
    setIsLoadingContext(true);
    setError(null);
    setChatHistory([{ role: 'assistant', content: 'Fetching the latest portfolio data from the database...' }]);

    try {
      // --- Fetch Latest Resume ---
      const { data: resumes, error: resumeError } = await supabase
        .from('resume_store')
        .select('file_url')
        .order('uploaded_at', { ascending: false })
        .limit(1);
      
      if (resumeError) throw resumeError;
      
      const resumeData = resumes?.[0];

      // Gracefully handle the case where no resume is found
      if (!resumeData || !resumeData.file_url) {
        setChatHistory([{ role: 'assistant', content: 'Welcome! No resume has been uploaded. An administrator needs to log in to upload a resume to get started.' }]);
        return; // Exit function, finally block will handle loading state
      }

      // Securely download the resume from the private bucket
      const filePath = resumeData.file_url;
      const { data: fileBlob, error: downloadError } = await supabase.storage.from('resumes').download(filePath);
      if (downloadError) throw downloadError;
      if (!fileBlob) throw new Error('Downloaded resume file is empty.');

      const file = new File([fileBlob], filePath.split('/').pop()!, { type: fileBlob.type });
      const resumeContent = await parseFile(file);

      // --- Fetch Profile Data (LinkedIn/GitHub) ---
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('linkedin_about, github_url')
        .limit(1);
        
      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
      }

      const profileData = profiles?.[0];

      const newContext = {
        resume: resumeContent,
        linkedIn: profileData?.linkedin_about || '',
        githubUrl: profileData?.github_url || '',
      };

      setContextData(newContext);
      setChatHistory([{ role: 'assistant', content: 'I have loaded the latest portfolio context. How can I help you?' }]);

    } catch (err: unknown) {
      console.error("Context fetch error:", err); // Log the raw error for debugging

      let message = 'An unexpected error occurred while loading the portfolio.';

      if (err instanceof Error) {
        // Standard JS Error
        message = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Potentially a Supabase error object
        if ('message' in err && typeof err.message === 'string' && err.message.trim()) {
          message = err.message;
        } else {
          // If it's an object without a message, stringify it for debugging, but don't show it to the user.
          const errDetails = JSON.stringify(err);
          console.error("Stringified error details:", errDetails);
          // Give a generic but helpful message to the user.
          message = 'Could not load portfolio context. This often happens when not logged in while trying to access a private resume file. Please try logging in as an administrator.';
        }
      } else if (typeof err === 'string' && err.trim()) {
        // A simple string was thrown
        message = err;
      }
      
      // Final sanity check for generic or unhelpful messages from the server
      if (message.trim() === '' || message.includes('{}') || message.toLowerCase().includes('object object')) {
          message = 'Could not load portfolio context. This often happens when not logged in while trying to access a private resume file. Please try logging in as an administrator.';
      }

      setError(message);
      setChatHistory([{ role: 'assistant', content: `Error: ${message}` }]);
    } finally {
      setIsLoadingContext(false);
    }
  }, []);
  
  // Handle auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  
  // Fetch context on initial load
  useEffect(() => {
    if (isOpen) {
      fetchAndSetContext();
    }
  }, [isOpen, fetchAndSetContext]);

  // Effect to initialize or reset chat when context changes
  useEffect(() => {
    if (contextData.resume && !isLoadingContext) {
      try {
        const newChat = initializeChat(contextData);
        setChat(newChat);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Error initializing AI session: ${errorMessage}`);
      }
    }
  }, [contextData, isLoadingContext]);

  const handleSendMessage = useCallback(async (message: string) => {
    setError(null);
    setIsThinking(true);

    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: '' }
    ]);
    
    if (!chat) {
      setIsThinking(false);
       setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].content = "The portfolio context is not loaded. I cannot answer questions right now.";
          return newHistory;
      });
      return;
    }

    try {
      const stream = await sendMessageStream(chat, message);
      let fullResponse = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if(chunkText) {
            fullResponse += chunkText;
            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1].content = fullResponse;
                return newHistory;
            });
        }
      }
    } catch (e) {
      console.error("Gemini API Error:", e); // Log the full error for debugging
      
      let errorMessage = 'An unknown error occurred.';

      // Handle the specific error structure from the SDK
      if (typeof e === 'object' && e !== null && 'error' in e) {
        const errorDetails = (e as any).error;
        if (errorDetails && typeof errorDetails.message === 'string') {
          try {
            // The message from the SDK can be a stringified JSON object
            const parsedMessage = JSON.parse(errorDetails.message);
            if (parsedMessage?.error?.message) {
              errorMessage = parsedMessage.error.message;
            } else {
              // If the nested structure isn't what we expect, use the raw message
              errorMessage = errorDetails.message;
            }
          } catch (jsonError) {
            // If it's not valid JSON, it's probably a plain error message
            errorMessage = errorDetails.message;
          }
        }
      } else if (e instanceof Error) { // Handle standard JavaScript errors
        errorMessage = e.message;
      }

      setError(`Error: ${errorMessage}`);
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].content = `Sorry, I encountered an error. ${errorMessage}`;
        return newHistory;
      });
    } finally {
      setIsThinking(false);
    }
  }, [chat]);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsSidebarOpen(false); // Close sidebar on logout
  };
  
  const handleNewResume = () => {
    fetchAndSetContext();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Chatbot Container */}
      <div className="relative w-full max-w-6xl mx-auto my-4 flex flex-col md:flex-row bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        {session && (
          <Sidebar 
            onNewResumeUploaded={handleNewResume} 
            session={session}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
        <main className="flex-1 flex flex-col h-[calc(100vh-2rem)] min-h-[600px] relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full text-gray-300 hover:text-white transition-all"
            aria-label="Close chatbot"
          >
            <CloseIcon />
          </button>
          
          <ChatInterface
            chatHistory={chatHistory}
            isThinking={isThinking || isLoadingContext}
            onSendMessage={handleSendMessage}
            error={error}
            isAuthenticated={!!session}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onLogoutClick={handleLogout}
            onMenuClick={() => setIsSidebarOpen(prev => !prev)}
          />
        </main>
      </div>
      
      {isLoginModalOpen && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  );
};

