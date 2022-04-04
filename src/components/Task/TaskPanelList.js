import * as React from 'react';

import TaskPanelListRow from './TaskPanelListRow';

const TaskPanelList = ({ 
  taskItems, 
  selectedTask, 
  selectedList, 
  onSelectTask, 
  onToggleTaskCompleteState, 
  onToggleListHideCompletedState 
}) => {
  const [completedTasks, setCompletedTasks] = React.useState(null);
  const [incompleteTasks, setIncompleteTasks] = React.useState(null);

  React.useEffect(() => {
    if (selectedList && taskItems) {
      setCompletedTasks(taskItems.filter((task) => task.is_complete && task.list_id === selectedList.id));
      setIncompleteTasks(taskItems.filter((task) => !task.is_complete && task.list_id === selectedList.id));
    }
  }, [taskItems, selectedList]);

  return (
    <main className='py-1 px-2 overflow-y-auto md:px-0'>
      {/* debug list */}
      {/* <p className='mt-2 mb-3 font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(selectedList).replaceAll(',"', ', "')}</p> */}

      {/* tasks - incomplete */}
      <ul className='grid gap-[3px]'>
        {incompleteTasks && incompleteTasks.map((task) => (
          <TaskPanelListRow
            key={task.id}
            task={task}
            selectedTask={selectedTask}
            onSelectTask={onSelectTask}
            onToggleTaskCompleteState={onToggleTaskCompleteState}
          />
        ))}
      </ul>

      {/* completed tasks section */}
      {completedTasks?.length !== 0 && (
        <>
          {/* is_complete task toggle */}
          <button 
            type='button'
            className='flex items-center rounded my-2 px-2 py-1 bg-white/50 text-sm hover:bg-white/80'
            onClick={onToggleListHideCompletedState}
          >
            {/* caret */}
            <span className={
              'px-1 scale-y-125 origin-center ' + 
              (!selectedList?.is_completed_hidden ? 'rotate-90' : '')}
            >
              &gt;
            </span>

            <p className='ml-1 mr-2'>
              Completed
            </p>
            
            {/* completed task count */}
            <span>{completedTasks?.length}</span>
          </button>

          {/* tasks - completed */}
          {!selectedList?.is_completed_hidden && (
            <ul className='grid gap-[3px]'>
              {completedTasks && completedTasks.map((task) => (
                <TaskPanelListRow
                  key={task.id}
                  task={task}
                  selectedTask={selectedTask}
                  onSelectTask={onSelectTask}
                  onToggleTaskCompleteState={onToggleTaskCompleteState}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  )
}
 
export default TaskPanelList;