/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import TaskCompletedToggle from "../TaskCompletedToggle";
import NoteIcon from "../../Icons/NoteIcon";

const TaskPanelListRow = ({ 
  task, 
  selectedTask, 
  onSelectTask, 
  onToggleTaskCompleteState 
}) => (
  <li className={
    'grid grid-cols-[auto,1fr] rounded-md min-h-[64px] bg-white text-black/90 cursor-pointer hover:bg-white/90 bp520:min-h-[50px] ' + 
    (task.id !== selectedTask?.id ? 'md:bg-white/80' : '')
  }>
    {/* debug */}
    {/* <p className='mt-2 mb-3 font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(task).replaceAll(',"', ', "')}</p> */}

    {/* toggle task is_complete */}
    <TaskCompletedToggle
      task={task}
      onToggle={onToggleTaskCompleteState}
    />

    {/* select task */}
    <button
      type='button'
      title='Open task'
      className='grid content-center py-1 pr-2 text-left bp520:text-sm'
      onClick={() => onSelectTask(task.id)}
    >
      {/* title */}
      <p className={
        'overflow-hidden text-ellipsis ' + 
        (task.is_complete ? 'block opacity-60 line-through' : '')
      }>
        {task?.title}
      </p>

      {/* note presence indicator */}
      {task.notes && task.notes.length > 0 && (
        <div className='flex items-center mt-[2px] text-xs text-black/60 leading-none'>
          <NoteIcon className='mr-[2px] w-4 h-4 stroke-current' />
          <span>Note</span>
        </div>
      )}
    </button>
  </li>
);
 
export default TaskPanelListRow;