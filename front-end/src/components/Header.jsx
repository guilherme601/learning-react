import { useState } from 'react';

// O Header se responsabiliza apenas pelo input de novas tarefas e a barra de progresso.
// Ele recebe "tasks" e "onAddTask" através das PROPS (Parâmetros que o componente Pai <App/> passa para ele)
function Header({ tasks, onAddTask }) {
  // useState só para controlar o texto dentro do input
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      onAddTask(input);
      setInput(""); // Limpa o input depois de adicionar
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'done').length;
  // Regra de três simples para criar uma porcentagem sem gerar NaN se dividir por 0
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <header className="header container-box">
      <div className="header-info">
        <h1>DashBoard To-Do</h1>
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
          <button className="add-btn" onClick={handleAdd}>
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
  );
}

export default Header;
