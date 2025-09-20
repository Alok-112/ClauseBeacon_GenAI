'use client';

import React from 'react';

type MarkdownRendererProps = {
  content: string;
};

// This is a basic markdown renderer.
// For a production app, a more robust library like 'react-markdown' would be better.
export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const renderContent = () => {
    if (!content) return null;

    // Helper function to process bold and italics
    const processInlineFormatting = (text: string, keyPrefix: string) => {
      // Process bold first (**text**)
      const boldParts = text.split('**');
      return boldParts.map((boldPart, i) => {
        if (i % 2 === 1) {
          return <strong key={`${keyPrefix}-bold-${i}`}>{boldPart}</strong>;
        }
        // Then process italics (*text*) within non-bold parts
        const italicParts = boldPart.split('*');
        return italicParts.map((italicPart, j) => {
          if (j % 2 === 1) {
            return <em key={`${keyPrefix}-italic-${i}-${j}`}>{italicPart}</em>;
          }
          return italicPart;
        });
      });
    };

    const lines = content.split('\n');

    const elements = lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Headings
      if (trimmedLine.startsWith('#### ')) {
        return <h4 key={index} className="text-md font-semibold mt-2 mb-1">{processInlineFormatting(trimmedLine.substring(5), `h4-${index}`)}</h4>;
      }
      if (trimmedLine.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold mt-3 mb-1">{processInlineFormatting(trimmedLine.substring(4), `h3-${index}`)}</h3>;
      }
      if (trimmedLine.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-4 mb-2">{processInlineFormatting(trimmedLine.substring(3), `h2-${index}`)}</h2>;
      }
      
      // Bullet points (* or -)
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        const itemContent = trimmedLine.substring(2);
        return <li key={index} className="ml-5 list-disc">{processInlineFormatting(itemContent, `li-${index}`)}</li>;
      }
      
      if (trimmedLine) {
        // Use a div instead of a p to avoid nesting errors
        return <div key={index} className="mb-2">{processInlineFormatting(line, `p-${index}`)}</div>;
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
