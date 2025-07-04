import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWorkflow } from '../contexts/WorkflowContext';
import CredentialManager from '../components/CredentialManager';
import FieldBuilder from '../components/FieldBuilder';
import QueryBuilder from '../components/QueryBuilder';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiSave, FiArrowLeft, FiSettings, FiDatabase, FiSearch } = FiIcons;

function WorkflowBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workflows, saveWorkflow } = useWorkflow();
  
  const [activeTab, setActiveTab] = useState('basic');
  const [workflow, setWorkflow] = useState({
    name: '',
    description: '',
    credentials: [],
    fields: [],
    query: {
      type: 'http',
      method: 'GET',
      url: '',
      headers: {},
      body: '',
      params: {}
    },
    webhookSettings: {
      enabled: true,
      authentication: 'none',
      apiKey: ''
    }
  });

  useEffect(() => {
    if (id) {
      const existingWorkflow = workflows.find(w => w.id === id);
      if (existingWorkflow) {
        setWorkflow(existingWorkflow);
      }
    }
  }, [id, workflows]);

  const handleSave = async () => {
    if (!workflow.name.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    try {
      const savedWorkflow = saveWorkflow(workflow);
      toast.success('Workflow saved successfully!');
      navigate(`/workflow/${savedWorkflow.id}`);
    } catch (error) {
      toast.error('Error saving workflow: ' + error.message);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiSettings },
    { id: 'credentials', label: 'Credentials', icon: FiDatabase },
    { id: 'fields', label: 'Fields', icon: FiDatabase },
    { id: 'query', label: 'Query Builder', icon: FiSearch }
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
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? 'Edit Workflow' : 'Create Workflow'}
            </h1>
            <p className="text-gray-600 mt-1">Configure your n8n workflow</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiSave} />
          <span>Save Workflow</span>
        </button>
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
          {activeTab === 'basic' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={workflow.name}
                  onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter workflow name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={workflow.description}
                  onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter workflow description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook Settings
                </label>
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={workflow.webhookSettings.enabled}
                      onChange={(e) => setWorkflow({
                        ...workflow,
                        webhookSettings: {
                          ...workflow.webhookSettings,
                          enabled: e.target.checked
                        }
                      })}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Enable webhook endpoint</label>
                  </div>

                  {workflow.webhookSettings.enabled && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Authentication
                        </label>
                        <select
                          value={workflow.webhookSettings.authentication}
                          onChange={(e) => setWorkflow({
                            ...workflow,
                            webhookSettings: {
                              ...workflow.webhookSettings,
                              authentication: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="none">None</option>
                          <option value="apikey">API Key</option>
                          <option value="bearer">Bearer Token</option>
                        </select>
                      </div>

                      {workflow.webhookSettings.authentication !== 'none' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            API Key / Token
                          </label>
                          <input
                            type="password"
                            value={workflow.webhookSettings.apiKey}
                            onChange={(e) => setWorkflow({
                              ...workflow,
                              webhookSettings: {
                                ...workflow.webhookSettings,
                                apiKey: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter API key or token"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'credentials' && (
            <CredentialManager
              credentials={workflow.credentials}
              onChange={(credentials) => setWorkflow({ ...workflow, credentials })}
            />
          )}

          {activeTab === 'fields' && (
            <FieldBuilder
              fields={workflow.fields}
              onChange={(fields) => setWorkflow({ ...workflow, fields })}
            />
          )}

          {activeTab === 'query' && (
            <QueryBuilder
              query={workflow.query}
              onChange={(query) => setWorkflow({ ...workflow, query })}
              credentials={workflow.credentials}
              fields={workflow.fields}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkflowBuilder;