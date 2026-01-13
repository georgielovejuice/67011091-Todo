import React, { useState, useEffect } from 'react';

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

function TodoList({ username, onLogout }) {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTodos();
    }, [username]);

    const fetchTodos = async () => {
        try {
            const response = await fetch(`${API_URL}/todos/${username}`);
            if (response.ok) {
                const data = await response.json();
                setTodos(data);
            }
        } catch (err) {
            console.error('Error fetching todos:', err);
        }
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const response = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, task: newTask }),
            });

            if (response.ok) {
                const newTodo = await response.json();
                setTodos([newTodo, ...todos]);
                setNewTask('');
            }
        } catch (err) {
            console.error('Error adding todo:', err);
        }
    };

    const handleToggleDone = async (id, currentDoneStatus) => {
        const newDoneStatus = !currentDoneStatus;
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done: newDoneStatus }),
            });

            if (response.ok) {
                setTodos(todos.map(todo => 
                    todo.id === id ? { ...todo, done: newDoneStatus } : todo
                ));
            }
        } catch (err) {
            console.error('Error toggling done status:', err);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setTodos(todos.filter(todo => todo.id !== id));
            }
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            {/* Professional Header */}
            <header className="w-full bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs">CEi</div>
                        <h1 className="font-bold text-gray-800">Todo List</h1>
                    </div>
                    <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="w-full max-w-md p-6 space-y-6">
                {/* Input Area */}
                <form onSubmit={handleAddTodo} className="relative group">
                    <input
                        type="text"
                        className="w-full pl-4 pr-14 py-4 rounded-2xl bg-white shadow-md border-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 placeholder:text-gray-400"
                        placeholder="New Task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white w-10 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
                        +
                    </button>
                </form>

                {/* List Items */}
                <div className="space-y-3">
                    {todos.map(todo => (
                        <div key={todo.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                            <div className="relative flex items-center justify-center h-6 w-6">
                                <input
                                    type="checkbox"
                                    className="peer h-6 w-6 rounded-full border-2 border-gray-200 text-blue-600 focus:ring-0 cursor-pointer appearance-none checked:bg-blue-600 checked:border-blue-600 transition-all"
                                    checked={!!todo.done}
                                    onChange={() => handleToggleDone(todo.id, todo.done)}
                                />
                                <svg className="absolute h-4 w-4 text-white pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            
                            <div className="flex-1 overflow-hidden">
                                <p className={`truncate font-medium transition-all ${todo.done ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                                    {todo.task}
                                </p>
                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                                    Updated: {new Date(todo.updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>

                            <button 
                                onClick={() => handleDeleteTodo(todo.id)} 
                                className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all px-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default TodoList;
