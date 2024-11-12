/* eslint-disable jsx-a11y/heading-has-content */
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [darkMode, setDarkMode] = useState(false); // Dark mode state
    const [isTypingDone, setIsTypingDone] = useState(false);

    // Typing animation for title
    useEffect(() => {
        const title = "BlinkNote";
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < title.length) {
                document.getElementById('title').innerHTML += title[index];
                index++;
            } else {
                clearInterval(typingInterval);
                setIsTypingDone(true); // Enable shadow effect after typing
            }
        }, 150); // Speed of typing animation

        return () => clearInterval(typingInterval);
    }, []);

    const handleSummarize = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSummary(data.summary);
        } catch (error) {
            console.error('Error summarizing text:', error);
            setSummary("Error: Unable to summarize text");
        }
    };

    return (
        <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <h1 id="title" className={`title ${isTypingDone ? 'shadow' : ''}`}></h1>
            <div className="input-container">
                <textarea
                    className="text-input"
                    rows="10"
                    placeholder="Enter text to summarize..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button className="summarize-button" onClick={handleSummarize}>Summarize</button>
            </div>
            <div className="output-container">
                <h3>Summary:</h3>
                <p className="summary-output">{summary}</p>
            </div>
        </div>
    );
}

export default App;
