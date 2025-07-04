import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkflow } from '../contexts/WorkflowContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiActivity, FiCheck, FiX, FiEye, FiRefreshCw } = FiIcons;

function WebhookLogs() {
  const { webhookLogs } = useWorkflow();
  const [selectedLog, setSelectedLog] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredLogs = webhookLogs.filter(log => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return FiCheck;
      case 'error':
        return FiX;
      default:
        return FiActivity;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Webhook Logs</h1>
          <p className="text-gray-600 mt-1">Monitor webhook executions and responses</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} />
          </button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <SafeIcon icon={FiActivity} className="text-4xl text-gray-400 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
          <p className="text-gray-500">Webhook executions will appear here</p>
        </motion.div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Executions</h2>
            <div className="space-y-3">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow ${
                    selectedLog?.id === log.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <SafeIcon 
                        icon={getStatusIcon(log.status)} 
                        className={`text-sm p-1 rounded-full ${getStatusColor(log.status)}`} 
                      />
                      <span className="font-medium text-gray-900">{log.workflowName}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Execution Details</h2>
            {selectedLog ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{selectedLog.workflowName}</h3>
                    <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Workflow ID:</span>
                      <p className="text-gray-900 font-mono">{selectedLog.workflowId}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Timestamp:</span>
                      <p className="text-gray-900">{format(new Date(selectedLog.timestamp), 'MMM d, yyyy HH:mm:ss')}</p>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 block mb-2">Request Payload:</span>
                    <pre className="bg-gray-50 rounded-lg p-3 text-sm overflow-x-auto">
                      {JSON.stringify(selectedLog.payload, null, 2)}
                    </pre>
                  </div>

                  {selectedLog.response && (
                    <div>
                      <span className="font-medium text-gray-700 block mb-2">Response:</span>
                      <pre className="bg-gray-50 rounded-lg p-3 text-sm overflow-x-auto">
                        {JSON.stringify(selectedLog.response, null, 2)}
                      </pre>
                    </div>
                  )}

                  {selectedLog.error && (
                    <div>
                      <span className="font-medium text-gray-700 block mb-2">Error:</span>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                        {selectedLog.error}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <SafeIcon icon={FiEye} className="text-4xl text-gray-400 mb-4 mx-auto" />
                <p className="text-gray-500">Select a log entry to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WebhookLogs;