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
    <TaskCompletedToggle
      task={task}
      onToggle={onToggleTaskCompleteState}
    />
    <TaskContent
      task={task}
      onSelectTask={onSelectTask}
    />
  </li>
);

const TaskContent = ({
  task,
  onSelectTask,
}) => (
  <button
    type='button'
    title='Open task'
    className='grid content-center py-1 pr-2 text-left bp520:text-sm'
    onClick={() => onSelectTask(task.id)}
  >
    <TaskTitle 
      title={task.title}
      isComplete={task.is_complete}
    />

    {task.notes && (
      <TaskHasNoteIndicator />
    )}
  </button>
);

const TaskTitle = ({
  title,
  isComplete
}) => (
  <p className={
    'overflow-hidden text-ellipsis ' + 
    (isComplete ? 'block opacity-60 line-through' : '')
  }>
    {title}
  </p>
);

const TaskHasNoteIndicator = () => (
  <div className='flex items-center mt-[2px] text-xs text-black/60 leading-none'>
    <NoteIcon className='mr-[2px] w-4 h-4 stroke-current' />
    <span>Note</span>
  </div>
);
 
export default TaskPanelListRow;