import { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMessage = { sender: 'user', text: message };
    setChat([...chat, userMessage]);
    setMessage('');

    try {
      const { data } = await axios.post('http://localhost:5001/api/chat', { message });
      setChat((prev) => [...prev, { sender: 'bot', text: data.response }]);
    } catch (error) {
      setChat((prev) => [...prev, { sender: 'bot', text: 'Error: Could not get response'}]);
    }
  };

  return (
    <div className='app'>
      <h1>AI Chatbot</h1>
      <div className="chat-container">
        {chat.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder='Type your message...'
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
