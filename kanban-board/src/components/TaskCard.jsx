function TaskCard({ task, onDeleteTask }) {
  
  // onDragStart: Lança quando essa DIV que passamos começa a ser arrastada
  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task.id);
    
    // "requestAnimationFrame" diz ao navegador para injetar essa classe e alterar os pixels DO DEPOIS do clique acontecer para evitar engasgos
    requestAnimationFrame(() => {
      e.target.classList.add("dragging");
    });
  };

  // Evento descarregado quando solta o mouse proximo.
  const handleDragEnd = (e) => {
    // Remove a classe "dragging" (que deixa o cartão meio transparente CSS) ao terminar sua viagem
    e.target.classList.remove("dragging");
  };

  return (
    <div 
      className="task-card"
      // Indica ao navegador que essa área DIV é Arrastável (Muito importante)
      draggable={true} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-content">
        <span className="task-text">{task.text}</span>
      </div>
      
      {/* Container de Lixeira */}
      <button 
        className="delete-btn" 
        onClick={() => onDeleteTask(task.id)}
        title="Excluir tarefa"
      >
        <i className="ph ph-trash"></i>
      </button>
    </div>
  );
}

export default TaskCard;
