const TaskCompleteToggleButton = ({ 
  task, 
  onToggle,
  ...props
}) => (  
  <button
    type='button'
    title={task.is_complete ? 'Mark as incomplete' : 'Mark as complete'}
    onClick={() => onToggle(task)}
    className="group px-3"
    {...props}
  >
    {/* border */}
    <div className='group grid place-items-center w-[18px] h-[18px] border-2 border-slate-700 rounded-full'>
      {/* complete mark */}
      {!props.disabled && (
        <div className={
          'w-2 h-2 bg-slate-700/80 rounded-full transition-all group-hover:opacity-100 ' +
          (task.is_complete ? 'opacity-100 group-active:scale-50' : 'opacity-0 group-active:scale-150')
        } />
      )}
    </div>
  </button>
);
 
export default TaskCompleteToggleButton;