import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 mt-16">
        <Sidebar />
        <main className="flex-1 ml-64 p-6 bg-gray-100">
          <Outlet /> 
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;