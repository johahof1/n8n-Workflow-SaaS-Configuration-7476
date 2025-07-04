import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2, FiType, FiToggleLeft } = FiIcons;

function FieldBuilder({ fields, onChange }) {
  const addField = () => {
    const newField = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      defaultValue: '',
      options: []
    };
    onChange([...fields, newField]);
  };

  const updateField = (id, updates) => {
    onChange(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id) => {
    onChange(fields.filter(field => field.id !== id));
  };

  const addOption = (fieldId) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = [...field.options, { value: '', label: '' }];
      updateField(fieldId, { options: newOptions });
    }
  };

  const updateOption = (fieldId, optionIndex, updates) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = field.options.map((option, index) =>
        index === optionIndex ? { ...option, ...updates } : option
      );
      updateField(fieldId, { options: newOptions });
    }
  };

  const removeOption = (fieldId, optionIndex) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = field.options.filter((_, index) => index !== optionIndex);
      updateField(fieldId, { options: newOptions });
    }
  };

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Password' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'date', label: 'Date' },
    { value: 'file', label: 'File' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Form Fields</h3>
          <p className="text-sm text-gray-600">Define input fields for your workflow</p>
        </div>
        <button
          onClick={addField}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Field</span>
        </button>
      </div>

      <AnimatePresence>
        {fields.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          >
            <SafeIcon icon={FiType} className="text-4xl text-gray-400 mb-4 mx-auto" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No fields yet</h4>
            <p className="text-gray-600 mb-4">Add form fields to collect input data</p>
            <button
              onClick={addField}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add First Field
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field Name
                    </label>
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => updateField(field.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., email, username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field Type
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {fieldTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Display label"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Placeholder text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Value
                    </label>
                    <input
                      type="text"
                      value={field.defaultValue}
                      onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Default value"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Required field</label>
                  </div>
                </div>

                {(field.type === 'select' || field.type === 'radio') && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Options
                      </label>
                      <button
                        onClick={() => addOption(field.id)}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        + Add Option
                      </button>
                    </div>
                    <div className="space-y-2">
                      {field.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) => updateOption(field.id, optionIndex, { value: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Option value"
                          />
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) => updateOption(field.id, optionIndex, { label: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Option label"
                          />
                          <button
                            onClick={() => removeOption(field.id, optionIndex)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <SafeIcon icon={FiTrash2} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => removeField(field.id)}
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

export default FieldBuilder;