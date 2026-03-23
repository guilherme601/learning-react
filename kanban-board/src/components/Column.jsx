import TaskCard from './TaskCard';

function Column({ col, tasks, onMoveTask, onDeleteTask }) {

  // Chamado sempre que outro objeto arrastável passe 'livremente' por cima da Área da Column
  const handleDragOver = (e) => {
    // É necessário anular o comportamento padrão do navegador, só permitindo assim que ele aceite o Drop (um objeto ser laçado dentro dele)
    e.preventDefault(); 
  };

  // Chamado quando soltamos o botão do mouse em cima da Column
  const handleDrop = (e) => {
    e.preventDefault();
    // Recupera o valor do "taskId" que guardamos ao começar o movimento lá no TaskCard
    const taskId = e.dataTransfer.getData("taskId");
    
    // Manda chamar a Função do "App" enviando os dados de retorno  ([Identificação x] mudou para [Nova Localização y])
    if (taskId) {
      onMoveTask(taskId, col.id);
    }
  };

  return (
    <div 
      className="column"
      // Lincando as Event Listeners às chamadas da Column
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title">
          <i className={`ph ${col.icon}`} style={{color: col.color}}></i>
          <h2>{col.title}</h2>
        </div>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div className="task-list">
        {tasks.map(task => (
          // Injetador de Cards baseado na Prop que passamos (somente tarefas dessa coluna)
          <TaskCard 
            key={task.id} 
            task={task} 
            onDeleteTask={onDeleteTask} 
          />
        ))}

        {/* Usamos && para dar condições limpas (só mostre a frase caso a matriz seja zero) */}
        {tasks.length === 0 && (
          <div className="empty-column">
            <p>Solte os cards aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Column;
