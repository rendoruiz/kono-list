import TaskCompleteToggleButton from "./TaskCompleteToggleButton";

const TaskPanelListRow = ({ 
  task, 
  selectedTask, 
  onSelectTask, 
  onToggleTaskCompleteState 
}) => (
  <li className={
    'grid grid-cols-[auto,1fr] rounded-md cursor-pointer hover:bg-white/90 ' + 
    (task.id === selectedTask?.id ? 'bg-white' : 'bg-white/70')
  }>
    {/* <p className='mt-2 mb-3 font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(task).replaceAll(',"', ', "')}</p> */}

    {/* toggle task is_complete */}
    <TaskCompleteToggleButton
      task={task}
      onToggle={onToggleTaskCompleteState}
    />

    {/* select task */}
    <button
      type='button'
      title='Select task'
      onClick={() => onSelectTask(task)}
      className='flex-1 py-4 pr-2 text-sm text-left'
    >
      <p className={task.is_complete ? 'opacity-60 line-through' : ''}>
        {task?.title}
      </p>
    </button>
  </li>
);
 
export default TaskPanelListRow;