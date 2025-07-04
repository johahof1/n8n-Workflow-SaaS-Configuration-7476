import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWorkflow } from '../contexts/WorkflowContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiPlay, FiEdit, FiTrash2, FiClock, FiLink } = FiIcons;

function Dashboard() {
  const { workflows, deleteWorkflow, executeWorkflow } = useWorkflow();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow(id);
    }
  };

  const handleExecute = async (workflow) => {
    try {
      await executeWorkflow(workflow.id, { trigger: 'manual' });
      alert('Workflow executed successfully!');
    } catch (error) {
      alert('Error executing workflow: ' + error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-1">Manage your n8n workflows</p>
        </div>
        <Link
          to="/workflow/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>New Workflow</span>
        </Link>
      </div>

      {workflows.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <SafeIcon icon={FiPlus} className="text-4xl text-gray-400 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
          <p className="text-gray-500 mb-6">Create your first workflow to get started</p>
          <Link
            to="/workflow/new"
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} />
            <span>Create Workflow</span>
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow, index) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{workflow.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{workflow.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleExecute(workflow)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Execute workflow"
                  >
                    <SafeIcon icon={FiPlay} />
                  </button>
                  <Link
                    to={`/workflow/${workflow.id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit workflow"
                  >
                    <SafeIcon icon={FiEdit} />
                  </Link>
                  <button
                    onClick={() => handleDelete(workflow.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete workflow"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <SafeIcon icon={FiClock} className="mr-2" />
                  <span>Updated {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <SafeIcon icon={FiLink} className="mr-2" />
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    /webhook/{workflow.id}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to={`/workflow/${workflow.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;