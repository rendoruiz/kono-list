import TaskCompleteToggleButton from "./TaskCompleteToggleButton";

const TaskEditorPanel = ({ 
  task, 
  selectedList,
  onClosePanel,
  onToggleTaskCompleteState
}) => {
  return task && (
    <div className='px-2 w-full max-w-xs max-h-screen bg-slate-100'>
      {/* debug */}
      <p className='font-mono font-medium text-xs uppercase break-word'>
          {JSON.stringify(task)?.replaceAll(',"', ', "')}
      </p>

      {/* mobile navigation & list name / close panel */}
      <header className='grid grid-cols-[auto,1fr] items-center sm:grid-cols-1 sm:justify-items-end'>
        <button 
          type='button'
          className='grid place-items-center rounded w-8 h-8 text-lg leading-none hover:bg-slate-500/10 active:bg-slate-500/20'
          onClick={onClosePanel}
        >
          <span className='sm:hidden'>⬅️</span>
          <span className='hidden sm:block'>❌</span>
        </button>
      </header>

      <main className='grid'>
        <form>
          {/* task toggle & name */}
          <div>
            

          <TaskCompleteToggleButton
            task={task}
            onToggle={() => onToggleTaskCompleteState(task)}
          />
          </div>
        </form>
      </main>

      {/* date created, delete */}
      <footer>

      </footer>
    </div>
  )
}
 
export default TaskEditorPanel;