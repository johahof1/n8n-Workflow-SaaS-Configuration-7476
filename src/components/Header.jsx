import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiZap, FiHome, FiPlus, FiActivity } = FiIcons;

function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <SafeIcon icon={FiZap} className="text-2xl text-primary-600" />
            <span className="text-xl font-bold text-gray-900">n8n Flow</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={FiHome} className="text-lg" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/workflow/new"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/workflow/new') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={FiPlus} className="text-lg" />
              <span>New Workflow</span>
            </Link>

            <Link
              to="/logs"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/logs') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={FiActivity} className="text-lg" />
              <span>Logs</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;