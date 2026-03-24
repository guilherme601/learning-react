import Column from './Column';

const columnsConfig = [
  { id: 'todo', title: 'A Fazer', icon: 'ph-circle-dashed', color: '#8b5cf6' },
  { id: 'inProgress', title: 'Em Andamento', icon: 'ph-spinner-gap', color: '#3b82f6' },
  { id: 'done', title: 'Concluído', icon: 'ph-check-circle', color: '#22c55e' }
];

function Board({ tasks, onMoveTask, onDeleteTask }) {
  // Esse componente é apenas de renderização estrutural das Colunas (A Fazer, Andamento, Concluidos)
  // map() roda repetindo o componente Column para cada item numeração Array
  return (
    <div className="board">
      {columnsConfig.map(col => {
        // Filtramos as tarefas que pertencem apenas a esta coluna específica
        const colTasks = tasks.filter(t => t.status === col.id);
        
        return (
          <Column 
            key={col.id} 
            col={col} 
            tasks={colTasks} 
            onMoveTask={onMoveTask} 
            onDeleteTask={onDeleteTask} 
          />
        );
      })}
    </div>
  );
}

export default Board;
