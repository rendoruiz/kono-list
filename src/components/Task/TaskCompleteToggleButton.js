const TaskCompleteToggleButton = ({ 
  task, 
  onToggle,
  ...props
}) => (  
  <button
    type='button'
    title={'Toggle complete task - mark as ' + (task?.is_complete ? 'incomplete' : 'complete')}
    onClick={() => onToggle(task)}
    className="group py-1 px-3"
    {...props}
  >
    {/* border */}
    <div className={
      'group grid place-items-center border-2 rounded-full w-[18px] h-[18px] transition-colors ' +
      (task?.is_complete ? 'border-blue-600' : 'border-slate-700')
    }>
      {/* complete mark */}
      {!props.disabled && (
        <div className={
          'rounded-full w-1 h-1 transition-all group-hover:opacity-100 ' +
          (task?.is_complete ? 'bg-blue-600/80 opacity-100 scale-[1.75] group-active:scale-110' : 'bg-slate-700/80 opacity-0 scale-150 group-active:scale-110')
        } />
      )}
    </div>
  </button>
);
 
export default TaskCompleteToggleButton;