import React, { useState } from 'react';
import { SeverityOption } from '../types';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  showSeverityOptions: boolean;
}

const severityOptions: SeverityOption[] = ['mild', 'moderate', 'severe'];

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, showSeverityOptions }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleSeverityClick = (option: SeverityOption) => {
    onSendMessage(option);
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
      {showSeverityOptions ? (
        <div className="flex justify-around mb-4">
          {severityOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleSeverityClick(option)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 capitalize"
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            placeholder="Type your message..."
            aria-label="Type your message"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
};

export default InputArea;
