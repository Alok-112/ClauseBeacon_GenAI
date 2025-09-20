'use client';

import React from 'react';

type MarkdownRendererProps = {
  content: string;
};

// This is a very basic markdown renderer.
// For a production app, a more robust library like 'react-markdown' would be better.
export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const renderContent = () => {
    if (!content) return null;

    // Split by newlines to process line by line
    const lines = content.split('\n');

    const elements = lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Headings
      if (trimmedLine.startsWith('#### ')) {
        return <h4 key={index} className="text-md font-semibold mt-2 mb-1">{trimmedLine.substring(5)}</h4>;
      }
      if (trimmedLine.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold mt-3 mb-1">{trimmedLine.substring(4)}</h3>;
      }
      if (trimmedLine.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-4 mb-2">{trimmedLine.substring(3)}</h2>;
      }
      
      // Bullet points (* or -)
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        const itemContent = trimmedLine.substring(2);
        // Process bold within list items
        const boldedItem = itemContent.split('**').map((part, i) => 
            i % 2 === 1 ? <strong key={`bold-${index}-${i}`}>{part}</strong> : part
        );
        return <li key={index} className="ml-5 list-disc">{boldedItem}</li>;
      }
      
      // Paragraph with bold text (**)
      const parts = line.split('**').map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={`pbold-${index}-${i}`}>{part}</strong>;
        }
        return part;
      });

      if (trimmedLine) {
        // Use a div instead of a p to avoid nesting errors
        return <div key={index} className="mb-2">{parts}</div>;
      }

      return null;
    });

    // Group list items into <ul> elements
    const groupedElements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];

    elements.forEach((el, index) => {
      if (React.isValidElement(el) && el.type === 'li') {
        currentList.push(el);
      } else {
        if (currentList.length > 0) {
          groupedElements.push(<ul key={`ul-${index}`} className="space-y-1 mb-4">{currentList}</ul>);
          currentList = [];
        }
        if (el) {
          groupedElements.push(el);
        }
      }
    });

    if (currentList.length > 0) {
      groupedElements.push(<ul key="ul-last" className="space-y-1 mb-4">{currentList}</ul>);
    }
    
    return groupedElements;
  };

  return <div className="prose prose-sm max-w-none">{renderContent()}</div>;
};
