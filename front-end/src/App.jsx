import { useState, useEffect } from 'react';
import Header from './components/Header';
import Board from './components/Board';
import './index.css';

function App() {
  // Inicialização de Estado usando uma Função (Lazy Initialization)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanban_tasks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(t => ({
          ...t,
          status: t.status ? t.status : (t.done ? 'done' : 'todo')
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // useEffect - Executa código como Efeito Colateral
  // Toda vez que as 'tasks' forem alteradas, os dados do usuário serão salvos localmente
  useEffect(() => {
    localStorage.setItem("kanban_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Função para lidar com a adição de tarefas
  const addTask = (text) => {
    if (!text.trim()) return;
    setTasks([
      { id: Date.now(), text: text.trim(), status: 'todo' }, // id único baseado na data
      ...tasks
    ]);
  };

  // Função para deletar a tarefa. Usamos o filter() para manter todos que não tem aquele id.
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Função de mover o "status" da API Kanban no Drop
  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id.toString() === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="app-wrapper">
      {/* Passando "propriedades (props)" para componentes filhos */}
      <Header tasks={tasks} onAddTask={addTask} />
      <Board tasks={tasks} onMoveTask={moveTask} onDeleteTask={deleteTask} />
    </div>
  );
}

export default App;
