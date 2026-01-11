import React, { useState } from 'react';

const API_URL = (() => {
    if (typeof process !== 'undefined' && process?.env?.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return (
            import.meta.env.VITE_REACT_APP_API_URL ||
            import.meta.env.VITE_API_URL ||
            import.meta.env.REACT_APP_API_URL ||
            ''
        );
    }
        // default to local backend API (includes /api prefix expected by server)
    return 'http://localhost:5001/api';
})();

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim()) {
            setError('Please enter a username.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed.');
                return;
            }

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('todo_username', username);
                onLogin(username);
            }
        } catch (err) {
            setError('Network error: Could not connect to the server.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    {/* CEi Logo */}
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4">
                        CEi
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Login Successful</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 ml-1">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100"
                    >
                        Sign In
                    </button>
                </form>
                {error && <p className="text-red-500 text-xs mt-4 text-center font-medium">{error}</p>}
            </div>
        </div>
    );
}

export default Login;
