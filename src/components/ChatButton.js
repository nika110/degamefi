import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-4 right-4 bg-white text-[#00A3E0] rounded-full p-2"
  >
    <MessageCircle size={24} />
  </button>
);

export default ChatButton;
