
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type ChatMessage } from '../../types';
import { Message } from './Message';
import { SendIcon, LoginIcon, LogoutIcon, MenuIcon } from './icons';
import { FaMicrophone } from 'react-icons/fa6';

interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  isThinking: boolean;
  onSendMessage: (message: string) => void;
  error: string | null;
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onMenuClick: () => void;
}

// FIX: Add type definitions for the Web Speech API to resolve TypeScript errors.
// These interfaces are not part of standard DOM typings in all TypeScript configurations.
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onstart: () => void;
}

// Extend the window type for cross-browser SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  chatHistory, 
  isThinking, 
  onSendMessage, 
  error,
  isAuthenticated,
  onLoginClick,
  onLogoutClick,
  onMenuClick
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const baseTextRef = useRef('');

  const isSpeechRecognitionSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isThinking]);

  useEffect(() => {
    if (!isThinking && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isThinking]);

  const handleToggleListening = useCallback(() => {
    if (!isSpeechRecognitionSupported) {
        console.warn("Speech recognition not supported by this browser.");
        return;
    }

    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
    } else {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        baseTextRef.current = inputMessage ? `${inputMessage} ` : '';

        recognitionRef.current.onresult = (event) => {
            let interim_transcript = '';
            let final_transcript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            setInputMessage(baseTextRef.current + final_transcript + interim_transcript);
        };
        
        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => {
          setIsListening(false);
          recognitionRef.current = null;
        };
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.start();
    }
  }, [isListening, isSpeechRecognitionSupported, inputMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      recognitionRef.current?.stop();
    }
    if (inputMessage.trim() && !isThinking) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 relative">
      <header className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center">
        {isAuthenticated ? (
            <button
              onClick={onMenuClick}
              className="md:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700/60 rounded-lg hover:bg-gray-700 transition-all"
              aria-label="Toggle menu"
            >
              <MenuIcon />
            </button>
        ) : <div />} 
        
        {isAuthenticated ? (
          <button
            onClick={onLogoutClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/60 rounded-lg hover:bg-gray-700 transition-all"
            aria-label="Logout"
          >
            <LogoutIcon />
            <span className="hidden sm:inline">Logout</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-300 bg-gray-700/60 rounded-lg hover:bg-gray-700 transition-all ml-auto"
            aria-label="Login"
          >
            <LoginIcon />
            <span>Login</span>
          </button>
        )}
      </header>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pt-20">
        {chatHistory.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        {error && <div className="text-red-300 p-3 bg-red-900/50 rounded-lg">{error}</div>}
      </div>
      <div className="p-4 md:p-6 border-t border-gray-700/50 bg-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the portfolio..."
            rows={1}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50"
            disabled={isThinking}
            style={{ minHeight: '48px', maxHeight: '200px' }}
            onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
            }}
          />
           <button
            type="button"
            onClick={handleToggleListening}
            disabled={!isSpeechRecognitionSupported || isThinking}
            className={`p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'bg-red-600/20 text-red-400' : 'hover:bg-gray-700 text-gray-400'}`}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            title={isSpeechRecognitionSupported ? (isListening ? 'Stop listening' : 'Start voice input') : "Voice input not supported"}
          >
            <FaMicrophone className="h-6 w-6" />
          </button>
          <button
            type="submit"
            disabled={isThinking || !inputMessage.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

