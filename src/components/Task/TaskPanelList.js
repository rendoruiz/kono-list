/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import * as React from 'react';
import ChevronRightIcon from '../Icons/ChevronRightIcon';

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
    <main className='pt-1 pb-16 px-2 overflow-y-auto md:pb-1 md:px-0'>
      {/* debug list */}
      {/* <p className='mt-2 mb-3 font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(selectedList).replaceAll(',"', ', "')}</p> */}

      {/* tasks - incomplete */}
      <ul className='grid content-start gap-[3px]'>
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
            className='flex items-center rounded my-2 px-2 py-3 w-full leading-none hover:bg-black/10 sm:justify-self-start sm:py-1 sm:w-auto sm:bg-white/80 sm:text-sm sm:text-black/90 sm:hover:bg-white/90 sm:active:bg-white'
            onClick={onToggleListHideCompletedState}
          >
            {/* caret */}
            <ChevronRightIcon className={
              'w-5 h-5 stroke-[2.5] stroke-current transition-transform origin-center bp520:stroke-[1.5] ' +
              (!selectedList?.is_completed_hidden ? 'rotate-90' : '')
            } />

            <span className='ml-1 mr-2'>
              Completed
            </span>
            
            {/* completed task count */}
            <span className='pr-1 font-medium'>{completedTasks?.length}</span>
          </button>

          {/* tasks - completed */}
          {!selectedList?.is_completed_hidden && (
            <ul className='grid content-start gap-[3px]'>
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