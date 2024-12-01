import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Check } from 'lucide-react';
import questionnaireData from '../data/Questionnaire.json';

const answerKeys = ['name','investment_budget', 'investment_experience', 'investment_goal', 'risk_tolerance', 'interests', 'time_horizon'];

const Questionnaire = ({ onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);
  const [showAnswerOptions, setShowAnswerOptions] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);
  const isFirstRender = useRef(true);

  const currentQuestion = questionnaireData.questions[currentQuestionIndex];

  const addToChatHistory = useCallback((sender, message) => {
    setChatHistory(prev => [...prev, { sender, message }]);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      addToChatHistory('bot', currentQuestion.text);
      isFirstRender.current = false;
      setIsLoadingAnswers(true);
      setTimeout(() => {
        setIsLoadingAnswers(false);
        setShowAnswerOptions(true);
      }, 1500);
    } else if (currentQuestionIndex > 0) {
      setIsThinking(true);
      setShowAnswerOptions(false);
      const timer = setTimeout(() => {
        setIsThinking(false);
        addToChatHistory('bot', currentQuestion.text.replace('{name}', answers['name'] || 'there'));
        setIsLoadingAnswers(true);
        setTimeout(() => {
          setIsLoadingAnswers(false);
          setShowAnswerOptions(true);
        }, 1500);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, addToChatHistory, answers]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoadingAnswers, showAnswerOptions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentAnswer.trim() !== '') {
      addToChatHistory('user', currentAnswer);
      
      const key = answerKeys[currentQuestionIndex];
      const newAnswers = { ...answers, [key]: currentAnswer };
      setAnswers(newAnswers);

      localStorage.setItem('questionnaireAnswers', JSON.stringify(newAnswers));

      setCurrentAnswer('');
      setShowAnswerOptions(false);
      if (currentQuestionIndex < questionnaireData.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        onSubmit(newAnswers);
      }
    }
  };

  const renderInput = () => {
    if (!showAnswerOptions) return null;

    switch (currentQuestion.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={currentQuestion.type}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full p-3 text-degamefi-black rounded-degamefi border-2 border-degamefi-gray focus:outline-none focus:ring-2 focus:ring-degamefi-blue focus:border-transparent transition duration-300"
            placeholder="Type your answer..."
          />
        );
      case 'select':
        return (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-center p-3 bg-white rounded-degamefi border-2 border-degamefi-gray hover:border-degamefi-blue transition duration-300 cursor-pointer">
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="hidden"
                />
                <div className={`w-6 h-6 mr-3 flex items-center justify-center border-2 rounded-full ${currentAnswer === option ? 'border-degamefi-blue bg-degamefi-blue' : 'border-degamefi-gray'}`}>
                  {currentAnswer === option && <Check size={16} className="text-white" />}
                </div>
                <span className="text-degamefi-black">{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-degamefi-gray-light">
      <div className="bg-degamefi-blue p-4 text-degamefi-white shadow-degamefi">
        <h1 className="text-2xl font-bold">degamefi Bank</h1>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`flex ${chat.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-3/4 p-3 rounded-degamefi shadow-degamefi ${
              chat.sender === 'bot' ? 'bg-degamefi-blue text-degamefi-white' : 'bg-degamefi-white text-degamefi-blue'
            }`}>
              {chat.message}
            </div>
          </div>
        ))}
        {(isThinking || isLoadingAnswers) && (
          <div className="flex justify-start">
            <div className="bg-degamefi-blue text-degamefi-white p-3 rounded-degamefi shadow-degamefi">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-degamefi-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-degamefi-white rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-degamefi-white rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-degamefi-white shadow-degamefi">
        <div className="space-y-4">
          {renderInput()}
          {showAnswerOptions && (
            <button
              type="submit"
              className="w-full bg-degamefi-blue text-degamefi-white px-4 py-3 rounded-degamefi font-bold hover:bg-degamefi-blue-dark transition duration-300 flex items-center justify-center"
              disabled={currentAnswer.trim() === ''}
            >
              <Send size={20} className="mr-2" />
              Submit Answer
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Questionnaire;