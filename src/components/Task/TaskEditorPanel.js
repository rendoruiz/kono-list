import * as React from 'react';

import TaskCompleteToggleButton from "./TaskCompleteToggleButton";
import ResponsiveTextArea from '../ResponsiveTextArea';
import ArrowLeftIcon from '../Icons/ArrowLeftIcon';
import CrossIcon from '../Icons/CrossIcon';
import TrashIcon from '../Icons/TrashIcon';

const TaskEditorPanel = ({ 
  task, 
  selectedList,
  onClosePanel,
  onUpdateTask,
  onDeleteTask,
  onToggleTaskCompleteState
}) => {
  const [title, setTitle] = React.useState("");
  const [note, setNote] = React.useState("");

  const handleSubmit = (e) => {
    onUpdateTask({
      title: title,
      note: note,
    });
    e.preventDefault();
  }

  React.useEffect(() => {
    if (task) {
      setTitle(task.title ?? "");
      setNote(task.note ?? "")
    }
  }, [task]);

  return (
    <>
      {/* mobile backdrop toggle */}
      <div 
        className={
          'fixed inset-0 z-30 transition-opacity duration-300 bg-black/70 bp520:block lg:hidden ' +
          (task ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full')
        }
        onClick={onClosePanel}
      />

      {/* bp520 - floats, lg - inline */}
      <div className={
        'fixed inset-0 left-auto z-30 grid grid-rows-[auto,1fr,60px] w-full h-screen bg-slate-100 transition-transform duration-200 bp520:grid-rows-[auto,1fr,auto] bp520:max-w-[340px] lg:relative lg:z-auto lg:translate-x-0 lg:transition-none ' +
        (task ? 'lg:translate-x-0' : 'translate-x-full lg:hidden')
      }>
        {/* debug */}
        {/* <p className='font-mono font-medium text-xs uppercase break-word'>
            {JSON.stringify(selectedList)?.replaceAll(',"', ', "')}
        </p> 
        <p className='font-mono font-medium text-xs uppercase break-word'>
            {JSON.stringify(task)?.replaceAll(',"', ', "')}
        </p>  */}

        {/* task editor panel close button */}
        <header className='sticky top-0 grid grid-cols-[auto,1fr] items-center pt-5 px-2 bg-inherit text-black/80 bp520:pt-2 sm:grid-cols-1 sm:justify-items-end sm:px-3'>
          <button 
            type='button'
            title={`Back to "${selectedList.name}" list`}
            className='group grid p-[2px] leading-none'
            onClick={onClosePanel}
          >
            <div className='grid place-items-center rounded w-12 h-12 text-2xl group-hover:bg-slate-500/10 group-active:bg-slate-500/30 bp520:w-8 bp520:h-8 bp520:text-lg'>
              <ArrowLeftIcon className='w-8 h-8 stroke-current sm:hidden' />
              <CrossIcon className='hidden w-6 h-6 stroke-current sm:block' />
            </div>
          </button>
          <p className='pl-1 font-bold text-xl leading-none truncate sm:hidden'>
            { selectedList.name }
          </p>
        </header>

        {/* task form */}
        <main className='p-3 overflow-y-auto overflow-x-hidden'>
          <form 
            onSubmit={handleSubmit}
            className='grid gap-3'
          >
            {/* task toggle & name */}
            <div className='grid grid-cols-[auto,1fr] items-start border-[1.5px] border-slate-200 rounded py-4 bg-white/50 bp520:py-3'>
              <TaskCompleteToggleButton
                task={task}
                disabled={!task}
                onToggle={() => onToggleTaskCompleteState(task)}
              />

              <ResponsiveTextArea
                name='name'
                onBlur={handleSubmit}
                className={
                  'pt-2 pr-3 bg-transparent font-medium text-lg leading-snug resize-none outline-none appearance-none md:pt-[2px] ' +
                  (task?.is_complete ? 'line-through focus:no-underline' : '')
                }
                value={title}
                disabled={!task}
                onChange={setTitle}
                onEnter={handleSubmit}
              />
            </div>

            {/* notes */}
            <div className='grid border-[1.5px] border-slate-200 rounded bg-white/50'>
              <ResponsiveTextArea
                name='note'
                placeholder='Add note'
                onBlur={handleSubmit}
                className='px-3 pt-4 pb-8 bg-transparent resize-none outline-none appearance-none bp520:pt-3 bp520:text-sm'
                value={note}
                disabled={!task}
                onChange={setNote}
              />
            </div>
          </form>
        </main>

        {/* date created/completed, delete */}
        <footer className='fixed inset-0 top-auto grid grid-cols-[1fr,auto] items-center gap-1 border-t-2 p-[2px] bg-inherit bp520:sticky'>
          <div className='grid justify-self-start px-3 text-sm text-black/70 leading-none bp520:justify-self-center'>
            {task?.is_complete ? `Completed ${task?.date_updated}` : `Created ${task?.date_created}`}
          </div>

          <button
            type='button'
            title='Delete task'
            className='group grid p-[2px] text-black/80'
            disabled={!task}
            onClick={onDeleteTask}
          >
            <div className='grid place-items-center rounded w-12 h-12 text-2xl group-hover:bg-slate-500/10 group-active:bg-slate-500/30 bp520:w-10 bp520:h-10'>
              <TrashIcon className='w-7 h-7 stroke-current bp520:w-6 bp520:h-6' />
            </div>
          </button>
        </footer>
      </div>
    </>
  );
}
 
export default TaskEditorPanel;