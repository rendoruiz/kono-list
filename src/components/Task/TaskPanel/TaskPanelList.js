/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import * as React from 'react';
import { closestCenter, DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { TaskPanelListRow, SortableTaskPanelListRow } from './TaskPanelListRow';
import ChevronRightIcon from '../../Icons/ChevronRightIcon';

const TaskPanelList = ({ 
  taskItems, 
  selectedList, 
  selectedTask, 
  onSelectTask, 
  onToggleTaskCompleteState, 
  onToggleCompletedItemsVisibility,
}) => {
  const completedTasks = taskItems.filter((task) => task.is_complete && task.list_id === selectedList.id)
    .sort((a, b) => b.date_updated - a.date_updated);
  const incompleteTasks = taskItems.filter((task) => !task.is_complete && task.list_id === selectedList.id);
  const completedTaskCount = completedTasks.length ?? 0;

  return (
    <main className='pt-1 pb-16 px-2 overflow-y-auto md:pb-1 md:px-0'>
      {incompleteTasks && incompleteTasks.length > 0 && (
        <IncompleteTasks
          taskItems={incompleteTasks}
          selectedTask={selectedTask}
          onSelectTask={onSelectTask}
          onToggleTaskCompleteState={onToggleTaskCompleteState}
        />
      )}

      {completedTasks && completedTaskCount > 0 && (
        <>
          <CompletedTaskVisibilityToggle
            isHidden={!selectedList.is_completed_hidden}
            completedTaskCount={completedTaskCount}
            onToggleCompletedItemsVisibility={onToggleCompletedItemsVisibility}
          />

          {!selectedList.is_completed_hidden && (
            <CompletedTasks
              taskItems={completedTasks}
              selectedTask={selectedTask}
              onSelectTask={onSelectTask}
              onToggleTaskCompleteState={onToggleTaskCompleteState}
            />
          )}
        </>
      )}
    </main>
  )
}

const IncompleteTasks = ({
  taskItems,
  selectedTask,
  onSelectTask,
  onToggleTaskCompleteState,
}) => {
  const [activeDragItemId, setActiveDragItemId] = React.useState(null);
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 500,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
  );

  const handleDragStart = (event) => setActiveDragItemId(event.active.id);
  const handleDragEnd = (event) => {
    const { active: currentItem, over: targetItem } = event;
    // onReorderListItems(currentItem.id, targetItem.id);
    setActiveDragItemId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={taskItems}
        strategy={verticalListSortingStrategy}
      >
        <ul className='grid content-start gap-[3px]'>
          {taskItems.map((task) => (
            <SortableTaskPanelListRow
              key={task.id}
              task={task}
              selectedTask={selectedTask}
              onSelectTask={onSelectTask}
              onToggleTaskCompleteState={onToggleTaskCompleteState}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

const CompletedTasks = ({
  taskItems,
  selectedTask,
  onSelectTask,
  onToggleTaskCompleteState,
}) => (
  <ul className='grid content-start gap-[3px]'>
    {taskItems.map((task) => (
      <TaskPanelListRow
        key={task.id}
        task={task}
        selectedTask={selectedTask}
        onSelectTask={onSelectTask}
        onToggleTaskCompleteState={onToggleTaskCompleteState}
      />
    ))}
  </ul>
);

const CompletedTaskVisibilityToggle = ({
  isHidden,
  completedTaskCount,
  onToggleCompletedItemsVisibility,
}) => (
  <button 
    type='button'
    className='flex items-center rounded my-2 px-2 py-3 w-full leading-none first:!mt-0 hover:bg-black/10 sm:justify-self-start sm:py-1 sm:w-auto sm:bg-white/80 sm:text-sm sm:text-black/90 sm:hover:bg-white/90 sm:active:bg-white'
    onClick={onToggleCompletedItemsVisibility}
  >
    <ChevronRightIcon className={
      'w-5 h-5 stroke-[2.5] stroke-current transition-transform origin-center bp520:stroke-[1.5] ' +
      (isHidden ? 'rotate-90' : '')
    } />

    <span className='ml-1 mr-2'>
      Completed
    </span>
    
    <span className='pr-1 font-medium'>
      {completedTaskCount}
    </span>
  </button>
);
 
export default TaskPanelList;