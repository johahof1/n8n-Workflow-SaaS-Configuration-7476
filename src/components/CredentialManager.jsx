import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2, FiEye, FiEyeOff, FiKey } = FiIcons;

function CredentialManager({ credentials, onChange }) {
  const [showPasswords, setShowPasswords] = useState({});

  const addCredential = () => {
    const newCredential = {
      id: Date.now().toString(),
      name: '',
      type: 'api_key',
      value: '',
      description: ''
    };
    onChange([...credentials, newCredential]);
  };

  const updateCredential = (id, updates) => {
    onChange(credentials.map(cred => 
      cred.id === id ? { ...cred, ...updates } : cred
    ));
  };

  const removeCredential = (id) => {
    onChange(credentials.filter(cred => cred.id !== id));
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const credentialTypes = [
    { value: 'api_key', label: 'API Key' },
    { value: 'bearer_token', label: 'Bearer Token' },
    { value: 'basic_auth', label: 'Basic Auth' },
    { value: 'oauth2', label: 'OAuth2' },
    { value: 'custom', label: 'Custom' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Credentials</h3>
          <p className="text-sm text-gray-600">Manage authentication credentials for your workflow</p>
        </div>
        <button
          onClick={addCredential}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Credential</span>
        </button>
      </div>

      <AnimatePresence>
        {credentials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          >
            <SafeIcon icon={FiKey} className="text-4xl text-gray-400 mb-4 mx-auto" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No credentials yet</h4>
            <p className="text-gray-600 mb-4">Add credentials to authenticate with external services</p>
            <button
              onClick={addCredential}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add First Credential
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {credentials.map((credential, index) => (
              <motion.div
                key={credential.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credential Name
                    </label>
                    <input
                      type="text"
                      value={credential.name}
                      onChange={(e) => updateCredential(credential.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Slack API Key"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={credential.type}
                      onChange={(e) => updateCredential(credential.id, { type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {credentialTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords[credential.id] ? 'text' : 'password'}
                        value={credential.value}
                        onChange={(e) => updateCredential(credential.id, { value: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter credential value"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(credential.id)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={showPasswords[credential.id] ? FiEyeOff : FiEye} />
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={credential.description}
                      onChange={(e) => updateCredential(credential.id, { description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Optional description"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => removeCredential(credential.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CredentialManager;