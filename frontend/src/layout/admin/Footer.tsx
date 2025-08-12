import React from 'react';

interface FooterProps {
  className?: string; 
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`bg-[#99b2cb] text-black p-4 text-center ${className || ''}`}>
      <p>&copy; 2025 Workscape. All rights reserved.</p>
    </footer>
  );
};

export default Footer;