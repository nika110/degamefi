import React from 'react';
import { AlertTriangle, Check, ExternalLink } from 'lucide-react';

const Disclaimer = ({ onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-degamefi-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-degamefi-blue-light">
      <div className="flex items-center mb-4">
        <AlertTriangle className="text-yellow-400 mr-2" size={24} />
        <h2 className="text-2xl font-bold text-degamefi-blue-light">Disclaimer</h2>
      </div>
      <p className="text-degamefi-gray-light mb-6 leading-relaxed">
        This AI is not a licensed financial advisor. All investment decisions carry risks. 
        Please consult with a professional before making any investment decisions.
      </p>
      <div className="space-y-4">
        <button 
          onClick={onConfirm} 
          className="w-full bg-degamefi-blue-light text-white px-4 py-3 rounded-lg font-bold hover:bg-degamefi-blue transition-colors duration-300 flex items-center justify-center"
        >
          <Check className="mr-2" size={20} />
          I Understand and Accept
        </button>
        <a 
          href="#" 
          className="block text-center text-degamefi-blue-light hover:underline flex items-center justify-center"
          onClick={(e) => e.preventDefault()}
        >
          Learn More About Investment Risks
          <ExternalLink className="ml-1" size={16} />
        </a>
      </div>
    </div>
  </div>
);

export default Disclaimer;