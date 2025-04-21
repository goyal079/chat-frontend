import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon, DocumentTextIcon, StopIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { askBot } from '../apis/index.apis';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'analysis' | 'suggestion';
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, projectName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<number | undefined>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const stopStreaming = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = undefined;
    }
    setIsStreaming(false);
    setIsTyping(false);
  };

  const streamText = (text: string, callback: (text: string) => void) => {
    let currentIndex = 0;
    setIsStreaming(true);
    
    streamIntervalRef.current = setInterval(() => {
      if (currentIndex < text.length) {
        callback(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(streamIntervalRef.current);
        setIsStreaming(false);
        setIsTyping(false);
      }
    }, 20);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await askBot({
        project_id: projectName,
        message: inputMessage
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "",
        sender: 'ai',
        timestamp: new Date(),
        type: 'analysis'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      streamText(response?.response || "I'm analyzing your project files. I can help you understand the content, extract key information, and answer questions about your documents. What specific aspects would you like to explore?", (text) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.sender === 'ai') {
            lastMessage.text = text;
          }
          return newMessages;
        });
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response. Please try again.');
      setIsTyping(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ 
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      <div 
        className={`absolute inset-0 bg-black ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} 
        onClick={onClose} 
        style={{
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      
      <div 
        ref={drawerRef}
        className="fixed inset-y-0 right-0 flex max-w-full"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="w-screen max-w-2xl">
          <div className="flex h-full flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-700/50 px-6 py-4 bg-gradient-to-r from-gray-800/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-100">{projectName}</h2>
                  <p className="text-sm text-gray-400">AI Assistant</p>
                  <p className="text-base text-gray-300 mt-1">Chat with your project data and get insights</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white'
                        : 'bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <SparklesIcon className="h-4 w-4 text-indigo-400" />
                        <span className="text-xs text-indigo-400">
                          {message.type === 'analysis' ? 'Analyzing' : 'AI Assistant'}
                        </span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="text-xs mt-2 opacity-50">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 rounded-2xl px-4 py-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <SparklesIcon className="h-4 w-4 text-indigo-400" />
                      <span className="text-xs text-indigo-400">AI Assistant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      {isStreaming && (
                        <button
                          onClick={stopStreaming}
                          className="ml-2 text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-gray-700/50 rounded-lg"
                        >
                          <StopIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-700/50 p-4 bg-gradient-to-t from-gray-800/50 to-transparent">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about your project files..."
                  className="flex-1 rounded-xl bg-gray-800/50 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 border border-gray-700/50 shadow-inner"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-4 py-3 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/20"
                  disabled={!inputMessage.trim()}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDrawer;