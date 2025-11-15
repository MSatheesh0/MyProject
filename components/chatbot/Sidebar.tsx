
import React, { useState, useCallback, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { GithubIcon, LinkedinIcon, DocumentIcon, CloseIcon } from './icons';
import { supabase } from '../../services/supabaseClient';
import { type Session } from '@supabase/supabase-js';


interface SidebarProps {
  onNewResumeUploaded: () => void;
  session: Session;
  isOpen: boolean;
  onClose: () => void;
}

const GITHUB_URL_REGEX = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const ACCEPTED_FILE_TYPES_STRING = ".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";


export const Sidebar: React.FC<SidebarProps> = ({ onNewResumeUploaded, session, isOpen, onClose }) => {
  const [linkedInText, setLinkedInText] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [githubUrlError, setGithubUrlError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [resetFileUpload, setResetFileUpload] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('linkedin_about, github_url')
            .eq('id', session.user.id)
            .maybeSingle(); // Use maybeSingle() for robustness

        if (error) {
            console.error('Error fetching profile:', error);
        } else if (data) {
            setLinkedInText(data.linkedin_about || '');
            setGithubUrl(data.github_url || '');
        }
    };
    fetchProfile();
  }, [session.user.id]);

  const handleResumeUpload = useCallback(async (file: File) => {
    // ... validation logic remains the same
    if (!file) return;
    setUploadError(null);
    setUploadSuccess(false);
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      setResetFileUpload(c => c + 1);
      return;
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setUploadError(`Invalid file type detected. Please upload a valid PDF, DOCX, or TXT file.`);
        setResetFileUpload(c => c + 1);
        return;
    }
    setUploading(true);

    try {
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const fileName = `resume_${timestamp}.${file.name.split('.').pop()}`;
      
      const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, file);
      if (uploadError) throw uploadError;

      // Deactivate old resumes
      const { error: updateError } = await supabase.from('resume_store').update({ active: false }).eq('active', true);
      if (updateError) throw updateError;
      
      // Insert new resume record with file path
      const { error: insertError } = await supabase.from('resume_store').insert([{ file_url: fileName, active: true }]);
      if (insertError) throw insertError;

      setUploadSuccess(true);
      onNewResumeUploaded();
    
    } catch (error: any) {
      setUploadError(error.message || 'An unknown error occurred during upload.');
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadSuccess(false);
        setResetFileUpload(c => c + 1);
      }, 3000);
    }
  }, [onNewResumeUploaded]);

  const handleProfileSave = async () => {
    if (githubUrlError) {
        setSaveStatus('Cannot save, invalid GitHub URL.');
        setTimeout(() => setSaveStatus(''), 3000);
        return;
    }

    setSaveStatus('Saving...');
    const { error } = await supabase
        .from('profiles')
        .upsert({ 
            id: session.user.id, 
            linkedin_about: linkedInText, 
            github_url: githubUrl,
        });

    if (error) {
        setSaveStatus(`Error: ${error.message}`);
    } else {
        setSaveStatus('Profile saved successfully!');
    }
    setTimeout(() => setSaveStatus(''), 3000);
  };
  
  const handleGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setGithubUrl(newUrl);
    if (newUrl && !GITHUB_URL_REGEX.test(newUrl)) {
      setGithubUrlError('Invalid format. E.g: https://github.com/username');
    } else {
      setGithubUrlError(null);
    }
  };
  
  const sidebarClasses = `
    bg-gray-800 p-4 md:p-6 flex flex-col space-y-6 overflow-y-auto border-r border-gray-700/50 
    transform transition-transform duration-300 ease-in-out
    w-80 lg:w-96 fixed md:relative h-full z-40
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:flex-shrink-0
  `;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={onClose}></div>}
      <aside className={sidebarClasses}>
        <header className="pb-4 border-b border-gray-700/50 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">Portfolio Assistant</h1>
            <p className="text-sm text-gray-400 mt-1">Provide context for the AI</p>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </header>
        
        <div className="space-y-8 flex-1">
          <div>
            <FileUpload id="resume-upload" label="Upload Resume" onFileSelect={handleResumeUpload} acceptedTypes={ACCEPTED_FILE_TYPES_STRING} icon={<DocumentIcon />} resetTrigger={resetFileUpload} />
            {uploading && <p className="text-blue-300 text-sm mt-2">Uploading...</p>}
            {uploadError && <p className="text-red-400 text-sm mt-2">{uploadError}</p>}
            {uploadSuccess && <p className="text-green-400 text-sm mt-2">New resume uploaded successfully!</p>}
          </div>
          
          <div>
            <label htmlFor="linkedin-profile" className="flex items-center text-lg font-semibold text-gray-200 mb-2"> <LinkedinIcon /> <span className="ml-3">LinkedIn Profile</span> </label>
            <textarea id="linkedin-profile" rows={5} value={linkedInText} onChange={(e) => setLinkedInText(e.target.value)} onBlur={handleProfileSave} placeholder="Paste your LinkedIn 'About' section..." className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>
          
          <div>
            <label htmlFor="github-url" className="flex items-center text-lg font-semibold text-gray-200 mb-2"> <GithubIcon /> <span className="ml-3">GitHub URL</span> </label>
            <input id="github-url" type="text" value={githubUrl} onChange={handleGithubChange} onBlur={handleProfileSave} placeholder="e.g., https://github.com/username" className={`w-full bg-gray-700/50 border rounded-md p-3 focus:ring-2 transition ${githubUrlError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'}`} aria-invalid={!!githubUrlError} />
            {githubUrlError && <p className="text-red-400 text-sm mt-2">{githubUrlError}</p>}
            {saveStatus && <p className="text-sm mt-2 text-green-400">{saveStatus}</p>}
          </div>
        </div>
        
        <footer className="text-xs text-center text-gray-500 pt-6"> &copy; {new Date().getFullYear()} Personal Portfolio Assistant </footer>
      </aside>
    </>
  );
};

