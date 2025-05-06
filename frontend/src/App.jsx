import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h1>Users from Flask</h1>
      <ul>
        {users.map(u => <li key={u.id}>{u.name}</li>)}
      </ul>
    </div>
  );
}


export default App
