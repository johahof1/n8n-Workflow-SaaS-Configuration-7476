import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWorkflow } from '../contexts/WorkflowContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

const { FiArrowLeft, FiEdit, FiPlay, FiTrash2, FiCopy, FiLink, FiCode, FiSettings } = FiIcons;

function WorkflowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workflows, executeWorkflow, deleteWorkflow } = useWorkflow();
  const [workflow, setWorkflow] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const foundWorkflow = workflows.find(w => w.id === id);
    if (foundWorkflow) {
      setWorkflow(foundWorkflow);
      // Initialize form data with default values
      const initialData = {};
      foundWorkflow.fields.forEach(field => {
        initialData[field.name] = field.defaultValue || '';
      });
      setFormData(initialData);
    }
  }, [id, workflows]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow(id);
      navigate('/');
    }
  };

  const handleExecute = async () => {
    try {
      await executeWorkflow(id, formData);
      toast.success('Workflow executed successfully!');
    } catch (error) {
      toast.error('Error executing workflow: ' + error.message);
    }
  };

  const copyWebhookUrl = () => {
    const webhookUrl = `${window.location.origin}/webhook/${id}`;
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied to clipboard!');
  };

  const generateCurlCommand = () => {
    const webhookUrl = `${window.location.origin}/webhook/${id}`;
    const curlCommand = `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(formData, null, 2)}'`;
    return curlCommand;
  };

  if (!workflow) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflow...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiSettings },
    { id: 'test', label: 'Test', icon: FiPlay },
    { id: 'webhook', label: 'Webhook', icon: FiLink },
    { id: 'code', label: 'Code', icon: FiCode }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{workflow.name}</h1>
            <p className="text-gray-600 mt-1">{workflow.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExecute}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
          >
            <SafeIcon icon={FiPlay} />
            <span>Execute</span>
          </button>
          <Link
            to={`/workflow/${id}/edit`}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiEdit} />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
          >
            <SafeIcon icon={FiTrash2} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Credentials</h3>
                  {workflow.credentials.length === 0 ? (
                    <p className="text-gray-500">No credentials configured</p>
                  ) : (
                    <div className="space-y-2">
                      {workflow.credentials.map((cred) => (
                        <div key={cred.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{cred.name}</p>
                            <p className="text-sm text-gray-500">{cred.type}</p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Form Fields</h3>
                  {workflow.fields.length === 0 ? (
                    <p className="text-gray-500">No form fields configured</p>
                  ) : (
                    <div className="space-y-2">
                      {workflow.fields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{field.label || field.name}</p>
                            <p className="text-sm text-gray-500">{field.type}</p>
                          </div>
                          {field.required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Required
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Query Configuration</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <span className="ml-2 text-gray-900">{workflow.query.type}</span>
                    </div>
                    {workflow.query.method && (
                      <div>
                        <span className="font-medium text-gray-700">Method:</span>
                        <span className="ml-2 text-gray-900">{workflow.query.method}</span>
                      </div>
                    )}
                    {workflow.query.url && (
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">URL:</span>
                        <span className="ml-2 text-gray-900 break-all">{workflow.query.url}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'test' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-gray-900">Test Workflow</h3>
              
              {workflow.fields.length > 0 ? (
                <div className="space-y-4">
                  {workflow.fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label || field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'textarea' ? (
                        <textarea
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows={3}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select an option</option>
                          {field.options.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No form fields configured for this workflow.</p>
              )}

              <button
                onClick={handleExecute}
                className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <SafeIcon icon={FiPlay} />
                <span>Execute Workflow</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'webhook' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-gray-900">Webhook Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/webhook/${id}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                    <button
                      onClick={copyWebhookUrl}
                      className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <SafeIcon icon={FiCopy} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authentication
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {workflow.webhookSettings.authentication === 'none' 
                        ? 'No authentication required' 
                        : `${workflow.webhookSettings.authentication} authentication enabled`
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Example cURL Command
                  </label>
                  <div className="relative">
                    <SyntaxHighlighter
                      language="bash"
                      style={tomorrow}
                      className="text-sm rounded-lg"
                    >
                      {generateCurlCommand()}
                    </SyntaxHighlighter>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generateCurlCommand());
                        toast.success('cURL command copied to clipboard!');
                      }}
                      className="absolute top-2 right-2 p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      <SafeIcon icon={FiCopy} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-gray-900">Workflow Configuration</h3>
              
              <div className="relative">
                <SyntaxHighlighter
                  language="json"
                  style={tomorrow}
                  className="text-sm rounded-lg"
                >
                  {JSON.stringify(workflow, null, 2)}
                </SyntaxHighlighter>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
                    toast.success('Configuration copied to clipboard!');
                  }}
                  className="absolute top-2 right-2 p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiCopy} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkflowDetail;