import React, { useState } from "react";
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/generate', { prompt });
      setResponse(res.data);
      setPrompt('');
    } catch (err) {
      console.log("Error generating response", err);
    }
  };

  const togglePromptDisplay = () => {
    setShowFullPrompt(!showFullPrompt);
  };
  const formatResponse = (text) => {
    return text.split('\n').map((str, index) => (
      <p key={index} className="response-paragraph">{str}</p>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Groq Edgechain Sample Project</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What you want to search from Groq"
            required
          />
          <button type="submit">Submit</button>
        </form>
        {response && (
          <div className="card">
            <h2>Your Query:</h2>
            <p>
              {showFullPrompt ? response.prompt : `${response.prompt.substring(0, 100)}...`}
              {response.prompt.length > 100 && (
                <button onClick={togglePromptDisplay}>
                  {showFullPrompt ? 'Read Less' : 'Read More'}
                </button>
              )}
            </p>
            <hr />
            <div className="response-content">
              {formatResponse(response.completion)}
            </div>
            {/* <p>{response.completion}</p> */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
