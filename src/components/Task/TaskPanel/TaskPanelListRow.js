/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';

import TaskCompletedToggle from "../TaskCompletedToggle";
import NoteIcon from "../../Icons/NoteIcon";

const TaskPanelListRow = ({ 
  task, 
  selectedTask, 
  onSelectTask, 
  onToggleTaskCompleteState,
  ...props
}) => (
  <li 
    className={
      'grid grid-cols-[auto,1fr] rounded-md min-h-[64px] bg-white text-black/90 cursor-pointer hover:bg-white/90 bp520:min-h-[50px] ' + 
      (task.id !== selectedTask?.id ? 'md:bg-white/80' : '')
    }
    {...props.sortableAttributes}
  >
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

const SortableTaskPanelListRow = ({
  task, 
  selectedTask, 
  onSelectTask, 
  onToggleTaskCompleteState,
  activeDragItemId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable(
    { id: task.id }
  );
  const sortableItemAttributes = {
    ref: setNodeRef,
    style: {
      transform: CSS.Transform.toString(transform),
      transition,
    },
    ...attributes,
    ...listeners,
  }

  return (
    <TaskPanelListRow
      task={task} 
      selectedTask={selectedTask} 
      onSelectTask={onSelectTask} 
      onToggleTaskCompleteState={onToggleTaskCompleteState}
      sortableAttributes={sortableItemAttributes}
    />
  );
}

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
  isComplete,
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
 
export { TaskPanelListRow, SortableTaskPanelListRow };