const { useState, useEffect } = React;

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanban_tasks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migramos os dados caso o usuário venha da versão antiga
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
  const [input, setInput] = useState("");

  // Salvar no localStorage sempre que 'tasks' mudar
  useEffect(() => {
    localStorage.setItem("kanban_tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (!input.trim()) return;

    setTasks([
      { id: Date.now(), text: input.trim(), status: 'todo' },
      ...tasks
    ]);

    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      addTask();
    }
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  // --- Funções de Drag and Drop (Arrastar) ---
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("taskId", id);
    // Adiciona classe para estilizar sendo arrastado
    requestAnimationFrame(() => {
      e.target.classList.add("dragging");
    });
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessário para permitir o drop
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    if (taskId) {
      setTasks(tasks.map(task =>
        task.id.toString() === taskId ? { ...task, status: newStatus } : task
      ));
    }
  };

  const columns = [
    { id: 'todo', title: 'A Fazer', icon: 'ph-circle-dashed', color: '#8b5cf6' },
    { id: 'inProgress', title: 'Em Andamento', icon: 'ph-spinner-gap', color: '#3b82f6' },
    { id: 'done', title: 'Concluído', icon: 'ph-check-circle', color: '#22c55e' }
  ];

  const getFilteredTasks = (status) => tasks.filter(t => t.status === status);

  const totalCount = tasks.length;
  const completedCount = getFilteredTasks('done').length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="app-wrapper">
      <header className="header container-box">
        <div className="header-info">
          <h1>Kanban Board Pro</h1>
          <p className="subtitle">Gerencie seu fluxo de trabalho arrastando os cards</p>
        </div>
        
        <div className="header-actions">
          <div className="input-group">
            <div className="input-wrapper">
              <i className="ph ph-list-plus input-icon"></i>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Adicionar nova tarefa..."
                autoFocus
              />
            </div>
            <button className="add-btn" onClick={addTask}>
              <i className="ph ph-plus" style={{fontSize: '18px'}}></i>
              <span>Adicionar</span>
            </button>
          </div>
          
          <div 
            className="progress-ring" 
            style={{ background: `conic-gradient(var(--accent-color) ${progress}%, var(--surface-hover) 0)` }}
            title={`${progress}% concluído`}
          >
            <span>{progress}%</span>
          </div>
        </div>
      </header>

      <div className="board">
        {columns.map(col => {
          const colTasks = getFilteredTasks(col.id);
          return (
            <div 
              key={col.id} 
              className="column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="column-header">
                <div className="column-title">
                  <i className={`ph ${col.icon}`} style={{color: col.color}}></i>
                  <h2>{col.title}</h2>
                </div>
                <span className="task-count">{colTasks.length}</span>
              </div>
              
              <div className="task-list">
                {colTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="task-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="task-content">
                      <span className="task-text">{task.text}</span>
                    </div>
                    <button 
                      className="delete-btn" 
                      onClick={() => deleteTask(task.id)}
                      title="Excluir tarefa"
                    >
                      <i className="ph ph-trash"></i>
                    </button>
                  </div>
                ))}
                
                {colTasks.length === 0 && (
                  <div className="empty-column">
                    <p>Solte os cards aqui</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);