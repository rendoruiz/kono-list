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
    <div className='relative grid grid-rows-[auto,1fr,auto] gap-2 w-80 h-full max-h-screen bg-slate-100 overflow-scroll'>
      {/* debug */}
      {/* <p className='font-mono font-medium text-xs uppercase break-word'>
          {JSON.stringify(selectedList)?.replaceAll(',"', ', "')}
      </p> 
      <p className='font-mono font-medium text-xs uppercase break-word'>
          {JSON.stringify(task)?.replaceAll(',"', ', "')}
      </p>  */}

      {/* mobile navigation & list name / close panel */}
      <header className='sticky top-0 grid grid-cols-[auto,1fr] items-center pt-1 pb-3 px-2 bg-inherit sm:grid-cols-1 sm:justify-items-end sm:pb-0 sm:px-3'>
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

      <main className='px-2 sm:px-3'>
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
      <footer className='sticky bottom-0 grid grid-cols-[1fr,auto] items-center gap-1 border-t-2 py-[2px] pl-3 pr-1 bg-inherit sm:justify-items-center'>
        <div className='grid text-sm text-black/70 leading-none'>
          {task.is_complete ? `Completed ${task.date_updated}` : `Created ${task.date_created}`}
        </div>

        <button
          type='button'
          title='Delete task'
          className='group grid place-content-center rounded p-1 w-10 h-10  text-xl leading-none hover:bg-slate-500/10 active:bg-slate-500/20'
        >
          🗑️
        </button>
      </footer>
    </div>
  )
}
 
export default TaskEditorPanel;