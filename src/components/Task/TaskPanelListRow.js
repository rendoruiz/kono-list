import TaskCompleteToggleButton from "./TaskCompleteToggleButton";

const TaskPanelListRow = ({ 
  task, 
  selectedTask, 
  onSelectTask, 
  onToggleTaskCompleteState 
}) => (
  <li className={
    'grid grid-cols-[auto,1fr] rounded-md min-h-[64px] bg-white cursor-pointer hover:bg-white/90 bp520:min-h-[50px] ' + 
    (task.id !== selectedTask?.id ? 'md:bg-white/80' : '')
  }>
    {/* debug */}
    {/* <p className='mt-2 mb-3 font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(task).replaceAll(',"', ', "')}</p> */}

    {/* toggle task is_complete */}
    <TaskCompleteToggleButton
      task={task}
      onToggle={onToggleTaskCompleteState}
    />

    {/* select task */}
    <button
      type='button'
      title='Open task'
      className='grid content-center py-1 pr-2 text-left bp520:text-sm '
      onClick={() => onSelectTask(task)}
    >
      {/* title */}
      <p className={task.is_complete ? 'opacity-60 line-through' : ''}>
        {task?.title}
      </p>

      {/* note presence indicator */}
      {task.note && task.note.length > 0 && (
        <p className='mt-[2px] text-xs'>
          <span>📝</span>
          <span className="ml-[2px] text-black/60">Note</span>
        </p>
      )}
    </button>
  </li>
);
 
export default TaskPanelListRow;