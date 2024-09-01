'use client'
import type React from 'react';
import { Button } from './ui/button';

interface PDFDownloadButtonProps {
  htmlContent: string;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ htmlContent }) => {
  const exportToPDF = async () => {
    // Create a temporary container for the HTML content
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.classList.add('printable-content');

    document.body.appendChild(container);

    window.print();

    document.body.removeChild(container);
  };

  return (
    <Button 
      onClick={exportToPDF} 
      disabled={!htmlContent} 
    >
      Download PDF  
    </Button>
  );
};

export default PDFDownloadButton;