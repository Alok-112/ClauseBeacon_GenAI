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
      line = line.trim();

      // Headings (##)
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-4 mb-2">{line.substring(3)}</h2>;
      }
      
      // Bullet points (* or -)
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const itemContent = line.substring(2);
        // Process bold within list items
        const boldedItem = itemContent.split('**').map((part, i) => 
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        );
        return <li key={index} className="ml-5 list-disc">{boldedItem}</li>;
      }
      
      // Bold text (**)
      const parts = line.split('**');
      const renderedParts = parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i}>{part}</strong>;
        }
        return part;
      });

      if (line) {
        return <p key={index} className="mb-2">{renderedParts}</p>;
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

  return <>{renderContent()}</>;
};
