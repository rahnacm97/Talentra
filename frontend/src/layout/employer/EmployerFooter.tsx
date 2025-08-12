import React from 'react';

const EmployerFooter: React.FC = () => {
   const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2f3e4d] text-white p-4 mt-auto text-center  bottom-0 w-full z-30">
      <p>&copy; {currentYear} Workscape. All rights reserved.</p>
      <p className="text-sm">
        <a href="/terms" className="text-blue-300 hover:underline mx-2">Terms</a> |
        <a href="/privacy" className="text-blue-300 hover:underline mx-2">Privacy</a> |
        <a href="/contact" className="text-blue-300 hover:underline mx-2">Contact</a>
      </p>
    </footer>
  );
};

export default EmployerFooter;