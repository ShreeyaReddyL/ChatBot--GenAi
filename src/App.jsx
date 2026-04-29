import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { personas } from './personas';
import { generateResponse } from './gemini';
import './App.css';

function App() {
  const [activePersonaKey, setActivePersonaKey] = useState('anshuman');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const activePersona = personas[activePersonaKey];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Reset conversation when persona changes
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hi, I'm ${activePersona.name}, ${activePersona.role}. How can I help you today?`
      }
    ]);
    setError(null);
  }, [activePersonaKey]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const currentMessages = [...messages, userMessage];
      const responseText = await generateResponse(
        activePersona.systemPrompt, 
        currentMessages
      );

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar / Persona Switcher */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <Sparkles className="logo-icon" />
            <h1>ScalerChat</h1>
          </div>
          <p className="subtitle">Select a persona to start learning</p>
        </div>

        <div className="persona-list">
          {Object.entries(personas).map(([key, persona]) => (
            <button
              key={key}
              className={`persona-button ${activePersonaKey === key ? 'active' : ''}`}
              onClick={() => setActivePersonaKey(key)}
              style={{
                '--theme-color': persona.themeColor,
                backgroundColor: activePersonaKey === key ? persona.themeColor + '15' : 'transparent',
                borderColor: activePersonaKey === key ? persona.themeColor : 'transparent'
              }}
            >
              <div 
                className="persona-avatar"
                style={{ backgroundColor: persona.themeColor }}
              >
                {persona.avatar}
              </div>
              <div className="persona-info">
                <span className="persona-name">{persona.name}</span>
                <span className="persona-role">{persona.role}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header" style={{ borderBottomColor: activePersona.themeColor }}>
          <div className="header-persona-info">
            <div 
              className="header-avatar"
              style={{ backgroundColor: activePersona.themeColor }}
            >
              {activePersona.avatar}
            </div>
            <div>
              <h2>{activePersona.name}</h2>
              <span className="header-role">Chatting with {activePersona.role}</span>
            </div>
          </div>
          <button 
            className="reset-button"
            onClick={() => setActivePersonaKey(activePersonaKey)}
            title="Reset Conversation"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="messages-area">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message-wrapper ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-content">
                {msg.role === 'assistant' && (
                  <div 
                    className="message-avatar assistant-avatar"
                    style={{ backgroundColor: activePersona.themeColor }}
                  >
                    {activePersona.avatar}
                  </div>
                )}
                
                <div 
                  className={`message-bubble ${msg.role === 'user' ? 'user-bubble' : 'assistant-bubble'}`}
                  style={msg.role === 'user' ? { backgroundColor: activePersona.themeColor } : {}}
                >
                  {msg.role === 'user' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <ReactMarkdown className="markdown-content">{msg.content}</ReactMarkdown>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="message-avatar user-avatar">
                    <User size={16} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="message-wrapper assistant-message">
              <div className="message-content">
                <div 
                  className="message-avatar assistant-avatar"
                  style={{ backgroundColor: activePersona.themeColor }}
                >
                  {activePersona.avatar}
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="suggestion-chips">
            {activePersona.suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="chip"
                onClick={() => handleSendMessage(suggestion)}
                style={{ borderColor: activePersona.themeColor, color: activePersona.themeColor }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${activePersona.name} something...`}
              rows={1}
            />
            <button 
              className="send-button"
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              style={{ 
                backgroundColor: inputValue.trim() && !isLoading ? activePersona.themeColor : '#e5e7eb' 
              }}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="input-footer">AI-generated content may be inaccurate. Verify important information.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
