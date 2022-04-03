import TaskCompleteToggleButton from "./TaskCompleteToggleButton";

const TaskPanelListRow = ({ 
  task, 
  selectedTask, 
  onSelectTask, 
  onToggleTaskCompleteState 
}) => (
  <li className={
    'grid grid-cols-[auto,1fr] rounded-md py-1 min-h-[50px] cursor-pointer hover:bg-white/90 ' + 
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
      className='flex-1 grid content-center pr-2 text-sm text-left'
      onClick={() => onSelectTask(task)}
    >
      {/* title */}
      <p className={task.is_complete ? 'opacity-60 line-through' : ''}>
        {task?.title}
      </p>

      {/* note presence indicator */}
      {task.note && task.note.length > 0 && (
        <p className=' mt-[2px] text-xs'>
          <span>📝</span>
          <span className="ml-[2px] text-black/60">Note</span>
        </p>
      )}
    </button>
  </li>
);
 
export default TaskPanelListRow;