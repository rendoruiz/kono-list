const TaskEditorPanel = ({ 
  task, 
  isOpen, 
  onToggleView 
}) => {
  return isOpen && (
    <div className='w-80 max-h-screen bg-green-300/30'>
      <p className='font-mono font-medium text-xs uppercase break-word'>
        {JSON.stringify(task)?.replaceAll(',"', ', "')}
      </p>
    </div>
  )
}
 
export default TaskEditorPanel;