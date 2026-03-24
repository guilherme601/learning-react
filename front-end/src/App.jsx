import { useState, useEffect } from 'react';
import Header from './components/Header';
import Board from './components/Board';
import './index.css';

const API_URL = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);

  // Quando o app carrega, buscamos as tarefas do Back-end
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Erro ao carregar tarefas:", err));
  }, []);

  // Função para adicionar tarefa no Back-end
  const addTask = async (text) => {
    if (!text.trim()) return;
    
    const newTask = { 
      id: Date.now(), 
      text: text.trim(), 
      status: 'todo' 
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (response.ok) {
        setTasks([newTask, ...tasks]);
      }
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
    }
  };

  // Função para deletar tarefa no Back-end
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== id));
      }
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
    }
  };

  // Função para mover/atualizar tarefa no Back-end
  const moveTask = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setTasks(tasks.map(task =>
          task.id.toString() === taskId.toString() ? { ...task, status: newStatus } : task
        ));
      }
    } catch (err) {
      console.error("Erro ao mover tarefa:", err);
    }
  };

  return (
    <div className="app-wrapper">
      <Header tasks={tasks} onAddTask={addTask} />
      <Board tasks={tasks} onMoveTask={moveTask} onDeleteTask={deleteTask} />
    </div>
  );
}

export default App;

