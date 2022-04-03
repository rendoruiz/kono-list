import * as React from 'react';

import TaskCompleteToggleButton from "./TaskCompleteToggleButton";
import ResponsiveTextArea from '../ResponsiveTextArea';

const TaskEditorPanel = ({ 
  task, 
  selectedList,
  onClosePanel,
  onToggleTaskCompleteState
}) => {
  const handleSubmit = (e) => {
    console.log("Task changed!");

    e?.preventDefault();
  }

  return task && (
    <div className='grid gap-2 content-start px-2 w-80 max-h-screen bg-white/50 overflow-scroll'>
      {/* debug */}
      {/* <p className='font-mono font-medium text-xs uppercase break-word'>
          {JSON.stringify(selectedList)?.replaceAll(',"', ', "')}
      </p> 
      <p className='font-mono font-medium text-xs uppercase break-word'>
          {JSON.stringify(task)?.replaceAll(',"', ', "')}
      </p>  */}

      {/* mobile navigation & list name / close panel */}
      <header className='grid grid-cols-[auto,1fr] items-center pt-1 pb-3 sm:grid-cols-1 sm:justify-items-end sm:pb-0'>
        <button 
          type='button'
          className='grid place-items-center rounded w-8 h-8 text-lg leading-none hover:bg-slate-500/10 active:bg-slate-500/20'
          onClick={onClosePanel}
        >
          <span className='sm:hidden'>⬅️</span>
          <span className='hidden sm:block'>❌</span>
        </button>
        <p className='pl-1 text-lg truncate sm:hidden'>
          { selectedList.name }
        </p>
      </header>

      <main>
        <form 
          onSubmit={handleSubmit}
          className='grid gap-3'
        >
          {/* task toggle & name */}
          <div className='grid grid-cols-[auto,1fr] items-start border-[1.5px] border-slate-200 rounded bg-white/50'>
            <TaskCompleteToggleButton
              task={task}
              onToggle={() => onToggleTaskCompleteState(task)}
            />
            <ResponsiveTextArea
              name='name'
              onBlur={handleSubmit}
              className={
                'py-2 pr-3 bg-transparent font-medium text-lg leading-snug resize-none outline-none appearance-none ' +
                (task.is_complete ? 'line-through focus:no-underline' : '')
              }
              value={task.title}
              onEnter={handleSubmit}
            />
          </div>

          {/* notes */}
          <div className='grid border-[1.5px] border-slate-200 rounded bg-white/50'>
            <ResponsiveTextArea
              name='note'
              placeholder='Add note'
              onBlur={handleSubmit}
              className='p-3 pb-8 bg-transparent text-sm resize-none outline-none appearance-none'
              value={task.note}
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