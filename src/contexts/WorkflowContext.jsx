import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const WorkflowContext = createContext();

const initialState = {
  workflows: [],
  webhookLogs: [],
  currentWorkflow: null,
  loading: false,
  error: null
};

function workflowReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_WORKFLOWS':
      return { ...state, workflows: action.payload, loading: false };
    case 'ADD_WORKFLOW':
      return { 
        ...state, 
        workflows: [...state.workflows, action.payload],
        loading: false 
      };
    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(w => 
          w.id === action.payload.id ? action.payload : w
        ),
        loading: false
      };
    case 'DELETE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.filter(w => w.id !== action.payload),
        loading: false
      };
    case 'SET_CURRENT_WORKFLOW':
      return { ...state, currentWorkflow: action.payload };
    case 'ADD_WEBHOOK_LOG':
      return {
        ...state,
        webhookLogs: [action.payload, ...state.webhookLogs].slice(0, 100)
      };
    case 'SET_WEBHOOK_LOGS':
      return { ...state, webhookLogs: action.payload };
    default:
      return state;
  }
}

export function WorkflowProvider({ children }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  useEffect(() => {
    loadWorkflows();
    loadWebhookLogs();
  }, []);

  const loadWorkflows = () => {
    try {
      const saved = localStorage.getItem('n8n-workflows');
      if (saved) {
        dispatch({ type: 'SET_WORKFLOWS', payload: JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
    }
  };

  const loadWebhookLogs = () => {
    try {
      const saved = localStorage.getItem('n8n-webhook-logs');
      if (saved) {
        dispatch({ type: 'SET_WEBHOOK_LOGS', payload: JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Error loading webhook logs:', error);
    }
  };

  const saveWorkflow = (workflow) => {
    try {
      const newWorkflow = {
        ...workflow,
        id: workflow.id || uuidv4(),
        updatedAt: new Date().toISOString()
      };

      let updatedWorkflows;
      if (workflow.id && state.workflows.find(w => w.id === workflow.id)) {
        updatedWorkflows = state.workflows.map(w => 
          w.id === workflow.id ? newWorkflow : w
        );
        dispatch({ type: 'UPDATE_WORKFLOW', payload: newWorkflow });
      } else {
        updatedWorkflows = [...state.workflows, newWorkflow];
        dispatch({ type: 'ADD_WORKFLOW', payload: newWorkflow });
      }

      localStorage.setItem('n8n-workflows', JSON.stringify(updatedWorkflows));
      return newWorkflow;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteWorkflow = (id) => {
    try {
      const updatedWorkflows = state.workflows.filter(w => w.id !== id);
      localStorage.setItem('n8n-workflows', JSON.stringify(updatedWorkflows));
      dispatch({ type: 'DELETE_WORKFLOW', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const executeWorkflow = async (workflowId, payload = {}) => {
    try {
      const workflow = state.workflows.find(w => w.id === workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const logEntry = {
        id: uuidv4(),
        workflowId,
        workflowName: workflow.name,
        timestamp: new Date().toISOString(),
        payload,
        status: 'success',
        response: { message: 'Workflow executed successfully', data: payload }
      };

      const updatedLogs = [logEntry, ...state.webhookLogs].slice(0, 100);
      localStorage.setItem('n8n-webhook-logs', JSON.stringify(updatedLogs));
      dispatch({ type: 'ADD_WEBHOOK_LOG', payload: logEntry });

      return logEntry.response;
    } catch (error) {
      const logEntry = {
        id: uuidv4(),
        workflowId,
        workflowName: 'Unknown',
        timestamp: new Date().toISOString(),
        payload,
        status: 'error',
        error: error.message
      };

      const updatedLogs = [logEntry, ...state.webhookLogs].slice(0, 100);
      localStorage.setItem('n8n-webhook-logs', JSON.stringify(updatedLogs));
      dispatch({ type: 'ADD_WEBHOOK_LOG', payload: logEntry });

      throw error;
    }
  };

  const value = {
    ...state,
    saveWorkflow,
    deleteWorkflow,
    executeWorkflow,
    setCurrentWorkflow: (workflow) => dispatch({ type: 'SET_CURRENT_WORKFLOW', payload: workflow })
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};