import React, { useRef, useState, useCallback, useEffect } from 'react';
import { UploadIcon, CheckIcon } from './icons';

interface FileUploadProps {
  id: string;
  label: string;
  onFileSelect: (file: File) => void;
  acceptedTypes: string;
  icon: React.ReactNode;
  isMultiple?: boolean;
  resetTrigger?: any; // A prop to trigger a reset
}

type UploadStatus = {
    type: 'success' | 'error';
    message: string;
} | null;

export const FileUpload: React.FC<FileUploadProps> = ({ id, label, onFileSelect, acceptedTypes, icon, isMultiple = false, resetTrigger }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to clear file name when reset is triggered
  useEffect(() => {
    setFileName(null);
    setUploadStatus(null);
  }, [resetTrigger]);

  useEffect(() => {
    if (uploadStatus) {
      const timer = setTimeout(() => {
        setUploadStatus(null);
        if (uploadStatus.type === 'error') {
            setFileName(null);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadStatus(null);
    const file = files[0];
    setFileName(file.name);
    
    // Pass the raw file up to the parent
    onFileSelect(file);

    // Parent component will now be responsible for showing upload status.
    // This component will just reflect the selected file.
    // For now, let's show a temporary success.
    setUploadStatus({ type: 'success', message: 'File selected.' });


    // Reset the input value to allow re-uploading the same file
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onFileSelect]);
  
  const getBorderColor = () => {
    if (!uploadStatus) return 'border-gray-600';
    switch (uploadStatus.type) {
      case 'success':
        return 'border-green-600';
      case 'error':
        return 'border-red-600';
      default:
        return 'border-gray-600';
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className={`w-full cursor-pointer bg-gray-700/50 hover:bg-gray-700 border-2 ${getBorderColor()} rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-300`}
      >
        <div className="text-blue-400 mb-2 scale-110">{icon}</div>
        <span className="text-lg font-semibold text-gray-200">{label}</span>
        {fileName && uploadStatus?.type !== 'error' ? (
          <span className="text-sm text-gray-400 mt-1 truncate">{fileName}</span>
        ) : (
          <span className="text-xs text-gray-400 mt-1">{acceptedTypes}</span>
        )}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        multiple={isMultiple}
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />
      {uploadStatus?.type === 'success' && (
        <div className="text-green-400 text-sm mt-2 flex items-center">
            <CheckIcon />
            <span className="ml-2">{uploadStatus.message}</span>
        </div>
      )}
      {uploadStatus?.type === 'error' && <p className="text-red-400 text-sm mt-2">{uploadStatus.message}</p>}
    </div>
  );
};

