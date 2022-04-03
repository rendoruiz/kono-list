import TaskCompleteToggleButton from "./TaskCompleteToggleButton";

const TaskEditorPanel = ({ 
  task, 
  selectedList,
  onClosePanel,
  onToggleTaskCompleteState
}) => {
  return task && (
    <div className='w-full max-w-xs max-h-screen bg-green-300/30'>
      {/* debug */}
      <p className='font-mono font-medium text-xs uppercase break-word'>
          {JSON.stringify(task)?.replaceAll(',"', ', "')}
      </p>

      {/* mobile navigation & list name / close panel */}
      <header className="grid grid-cols-[auto,1fr] items-center sm:grid-cols-1">
        <button className=" leading-none">
          <span>⬅️</span>
        </button>
      </header>

      <main className="grid">
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