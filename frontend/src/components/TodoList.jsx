import React, { useState, useEffect } from 'react';

const API_URL = (() => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_REACT_APP_API_URL ||
      'http://localhost:5001/api'
    );
  }
  return 'http://localhost:5001/api';
})();

function TodoList({ username, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [targetDatetime, setTargetDatetime] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [username]);

  const fetchTodos = async () => {
    const res = await fetch(`${API_URL}/todos/${username}`);
    const data = await res.json();
    setTodos(data);
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title || !targetDatetime) return;

    await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        title,
        target_datetime: targetDatetime.replace('T', ' ')
      })
    });

    setTitle('');
    setTargetDatetime('');
    fetchTodos();
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  const grouped = {
    Todo: todos.filter(t => t.status === 'Todo'),
    Doing: todos.filter(t => t.status === 'Doing'),
    Done: todos.filter(t => t.status === 'Done')
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 shadow-sm flex justify-between">
        <h1 className="font-bold text-gray-800">A4 Todo Board</h1>
        <button onClick={onLogout} className="text-red-400">Logout</button>
      </header>

      <main className="p-6 space-y-6">
        {/* Add Todo */}
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 rounded border"
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="datetime-local"
            className="p-3 rounded border"
            value={targetDatetime}
            onChange={e => setTargetDatetime(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 rounded">
            Add
          </button>
        </form>

        {/* Board */}
        <div className="grid grid-cols-3 gap-4">
          {['Todo', 'Doing', 'Done'].map(status => (
            <div key={status} className="bg-gray-100 p-4 rounded-xl">
              <h2 className="font-semibold mb-3">{status}</h2>

              {grouped[status].map(todo => (
                <div key={todo.id} className="bg-white p-3 rounded-lg shadow mb-2">
                  <p className="font-medium">{todo.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(todo.target_datetime.replace(' ', 'T')).toLocaleString()}
                  </p>

                  <div className="flex gap-1 mt-2">
                    {['Todo', 'Doing', 'Done'].map(s => (
                      s !== status && (
                        <button
                          key={s}
                          onClick={() => updateStatus(todo.id, s)}
                          className="text-xs px-2 py-1 bg-gray-200 rounded"
                        >
                          {s}
                        </button>
                      )
                    ))}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-xs px-2 py-1 bg-red-400 text-white rounded"
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TodoList;
