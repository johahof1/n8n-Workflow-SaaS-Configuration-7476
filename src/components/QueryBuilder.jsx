import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiCode, FiPlus, FiTrash2 } = FiIcons;

function QueryBuilder({ query, onChange, credentials, fields }) {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const updateQuery = (updates) => {
    onChange({ ...query, ...updates });
  };

  const addHeader = () => {
    const headers = { ...query.headers };
    headers[`header_${Date.now()}`] = '';
    updateQuery({ headers });
  };

  const updateHeader = (key, newKey, value) => {
    const headers = { ...query.headers };
    if (key !== newKey) {
      delete headers[key];
    }
    headers[newKey] = value;
    updateQuery({ headers });
  };

  const removeHeader = (key) => {
    const headers = { ...query.headers };
    delete headers[key];
    updateQuery({ headers });
  };

  const addParam = () => {
    const params = { ...query.params };
    params[`param_${Date.now()}`] = '';
    updateQuery({ params });
  };

  const updateParam = (key, newKey, value) => {
    const params = { ...query.params };
    if (key !== newKey) {
      delete params[key];
    }
    params[newKey] = value;
    updateQuery({ params });
  };

  const removeParam = (key) => {
    const params = { ...query.params };
    delete params[key];
    updateQuery({ params });
  };

  const testQuery = async () => {
    setTesting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestResult({
        success: true,
        status: 200,
        data: { message: 'Test successful', timestamp: new Date().toISOString() }
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const queryTypes = [
    { value: 'http', label: 'HTTP Request' },
    { value: 'webhook', label: 'Webhook' },
    { value: 'database', label: 'Database Query' },
    { value: 'custom', label: 'Custom Script' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Query Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Query Type
            </label>
            <select
              value={query.type}
              onChange={(e) => updateQuery({ type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {queryTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {query.type === 'http' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTTP Method
              </label>
              <select
                value={query.method}
                onChange={(e) => updateQuery({ method: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {httpMethods.map(method => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {query.type === 'http' && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                value={query.url}
                onChange={(e) => updateQuery({ url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://api.example.com/endpoint"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Headers
                </label>
                <button
                  onClick={addHeader}
                  className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1"
                >
                  <SafeIcon icon={FiPlus} />
                  <span>Add Header</span>
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(query.headers).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => updateHeader(key, e.target.value, value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Header name"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateHeader(key, key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Header value"
                    />
                    <button
                      onClick={() => removeHeader(key)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <SafeIcon icon={FiTrash2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Query Parameters
                </label>
                <button
                  onClick={addParam}
                  className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1"
                >
                  <SafeIcon icon={FiPlus} />
                  <span>Add Parameter</span>
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(query.params).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => updateParam(key, e.target.value, value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Parameter name"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateParam(key, key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Parameter value"
                    />
                    <button
                      onClick={() => removeParam(key)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <SafeIcon icon={FiTrash2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {(query.method === 'POST' || query.method === 'PUT' || query.method === 'PATCH') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Body
                </label>
                <textarea
                  value={query.body}
                  onChange={(e) => updateQuery({ body: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                  placeholder="Request body (JSON, XML, etc.)"
                />
              </div>
            )}
          </>
        )}

        <div className="flex items-center space-x-4">
          <button
            onClick={testQuery}
            disabled={testing}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <SafeIcon icon={FiPlay} />
            <span>{testing ? 'Testing...' : 'Test Query'}</span>
          </button>
        </div>

        {testResult && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Test Result</h4>
            <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default QueryBuilder;