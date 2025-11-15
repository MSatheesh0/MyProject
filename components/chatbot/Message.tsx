
import React, { useState } from 'react';
import { UserIcon, AssistantIcon, CopyIcon, CheckIcon } from './icons';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

export const Message: React.FC<MessageProps> = ({ role, content, isTyping = false }) => {
  const isUser = role === 'user';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard && content) {
      navigator.clipboard.writeText(content).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  const formatContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-6 space-y-2 my-3">
            {currentList.map((item, index) => (
              <li key={index}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const parseInlineMarkdown = (line: string): React.ReactNode => {
      // Split by **bold text** capture group, and filter out empty strings
      const parts = line.split(/(\*\*.*?\*\*)/g).filter(part => part);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-blue-300">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };
    
    const renderProjectHeader = (line: string, headingLevel: number, key: number) => {
        const TitleComponent = `h${headingLevel}` as React.ElementType;
        const titleClass = {
            1: "text-2xl font-bold mt-8 mb-4 text-blue-100",
            2: "text-xl font-bold mt-6 mb-3 text-blue-200",
            3: "text-lg font-bold mt-4 mb-2 text-blue-300",
        }[headingLevel] || "";
        
        return <TitleComponent key={key} className={titleClass}>{parseInlineMarkdown(line.substring(headingLevel + 1))}</TitleComponent>;
    };

    lines.forEach((line, index) => {
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        currentList.push(line.trim().substring(2));
        return;
      }

      flushList();

      if (line.trim().startsWith('### ')) {
        elements.push(renderProjectHeader(line.trim(), 3, index));
      } else if (line.trim().startsWith('## ')) {
        elements.push(renderProjectHeader(line.trim(), 2, index));
      } else if (line.trim().startsWith('# ')) {
        elements.push(renderProjectHeader(line.trim(), 1, index));
      } else if (line.trim() !== '') {
        elements.push(<p key={index} className="whitespace-pre-wrap my-1">{parseInlineMarkdown(line)}</p>);
      }
    });

    flushList(); // Flush any remaining list at the end of the text

    return elements;
  };

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'group'} animate-fade-in-up`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
          <AssistantIcon />
        </div>
      )}
      <div
        className={`max-w-xl lg:max-w-3xl rounded-lg p-4 shadow-md ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        {isTyping ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <div className="text-gray-200 prose-styles">{formatContent(content)}</div>
        )}
      </div>

      {!isUser && content && !isTyping && (
         <div className="self-center flex-shrink-0">
            <button 
                onClick={handleCopy}
                className="p-1.5 text-gray-500 rounded-full hover:bg-gray-600 hover:text-gray-200 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Copy message"
                title="Copy message"
            >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
            </button>
         </div>
      )}

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center border border-gray-500">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

