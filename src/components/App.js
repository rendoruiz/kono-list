/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

// components
import ListPanel from './List/ListPanel/ListPanel';
import ListEditorPanel from './List/ListEditorPanel/ListEditorPanel';
import TaskPanel from './Task/TaskPanel/TaskPanel';
import TaskEditorPanel from './Task/TaskEditorPanel/TaskEditorPanel';
import SettingsPanel from './SettingsPanel';
import DisclaimerPanel from './DisclaimerPanel';
// hooks, reducers, data, utils
import { listReducer, LIST_ACTION, defaultList } from '../reducers/listReducer';
import { taskReducer, TASK_ACTION, defaultTask } from '../reducers/taskReducer';
import { setEncryptedList, setEncryptedTask } from '../utils/encryptedStorage';

const App = () => {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = React.useState(false);
  const [list, dispatchList] = React.useReducer(listReducer, defaultList);
  const [task, dispatchTask] = React.useReducer(taskReducer, defaultTask);
  
  // Store data on localStorage, with encryption, every update
  React.useEffect(() => {
    setEncryptedList(list);
  }, [list]);
  React.useEffect(() => {
    setEncryptedTask(task);
  }, [task]);


  // Create new list item
  // Use the new list item as selected list
  // Close list editor panel
  const handleCreateList = () => {
    dispatchList({
      type: LIST_ACTION.CREATE_ITEM,
      payload: { listId: uuidv4() },
    });
  }

  // (if new list) Delete recently created list item
  // (if new list) Assign the previous list as the selected list
  // Close list editor panel 
  const handleCloseListEditor = () => {
    if (!list.selectedItem.date_updated) {
      dispatchList({
        type: LIST_ACTION.DELETE_ITEM,
        payload: { listId: list.selectedItem },
      });
    }
    dispatchList({ type: LIST_ACTION.TOGGLE_EDITOR_PANEL });
  }

  // Update list item
  // Set new selected list
  // Close list editor panel
  // (if new list) Close task editor
  const handleUpdateList = (listItem) => {
    if (list.selectedItem.locked) {
      alert('Cannot update locked list.');
      dispatchList({ type: LIST_ACTION.TOGGLE_EDITOR_PANEL });
      return;
    }

    dispatchList({
      type: LIST_ACTION.UPDATE_ITEM,
      payload: {
        listId: listItem.id,
        name: listItem.name,
        icon: listItem.icon,
      }
    });

    if (!list.selectedItem.date_updated) {
      dispatchTask({ type: TASK_ACTION.CLOSE_EDITOR_PANEL });
    }
  }

  // Delete selected list
  // Delete all tasks associated with selected list
  // Assign the previous list as the selected list
  const handleDeleteList = () => {
    if (list.selectedItem.locked) {
      alert('Cannot delete locked list.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete this list: "${list.selectedItem.name}"?`)) {
      dispatchList({
        type: LIST_ACTION.DELETE_ITEM,
        payload: { listId: list.selectedItem.id },
      });
      dispatchTask({
        type: TASK_ACTION.DELETE_LIST_TASKS,
        payload: { listId: list.selectedItem.list_id },
      });
    }
  }

  // Set selected list
  // Close list panel (mobile)
  // Close task editor
  const handleSetSelectedList = (listId) => {
    dispatchList({
      type: LIST_ACTION.SELECT_ITEM,
      payload: { listId: listId },
    });
    dispatchTask({ type: TASK_ACTION.CLOSE_EDITOR_PANEL });
  }

  // Toggle visibility of completed items within a list
  const handleToggleCompletedItemsVisibility = () => {
    dispatchList({
      type: LIST_ACTION.TOGGLE_COMPLETED_ITEMS_VISIBILITY,
      payload: { listId: list.selectedItem.id },
    });
  }

  // Toggle list panel (sidebar) visibility
  const handleToggleListPanel = () => dispatchList({ type: LIST_ACTION.TOGGLE_PANEL });

  // Toggle list editor panel (popup) visbility
  const handleToggleListEditorPanel = () => dispatchList({ type: LIST_ACTION.TOGGLE_EDITOR_PANEL });
  
  // Update list item indices (sorting)
  const handleUpdateListOrder = (activeListId, overListId) => {
    dispatchList({
      type: LIST_ACTION.UPDATE_INDICES,
      payload: {
        activeListId: activeListId,
        overListId: overListId,
      },
    })
  }

  // Create new task
  // Reset task creator form fields
  // Close task editor
  const handleCreateTask = (taskItem) => {
    dispatchTask({
      type: TASK_ACTION.CREATE_ITEM,
      payload: {
        taskId: uuidv4(),
        listId: list.selectedItem.id,
        title: taskItem.title,
      },
    });
  }

  // Update task item
  const handleUpdateTask = (taskItem) => {
    dispatchTask({
      type: TASK_ACTION.UPDATE_ITEM,
      payload: {
        taskId: task.selectedItem.id,
        title: taskItem.title,
        notes: taskItem.notes,
      },
    });
  }

  // Delete selected task
  const handleDeleteTask = () => {
    dispatchTask({
      type: TASK_ACTION.DELETE_ITEM,
      payload: { taskId: task.selectedItem.id },
    });
  }

  // Set selected task
  // (if same as selected task) Close task editor panel
  // (else) Open task editor panel
  const handleSetSelectedTask = (taskId) => {
    dispatchTask({
      type: TASK_ACTION.SELECT_ITEM,
      payload: { taskId: taskId },
    });
  }

  // Toggle task item completed value
  const handleToggleTaskCompleteState = (taskId) => {
    dispatchTask({
      type: TASK_ACTION.TOGGLE_ITEM_COMPLETED,
      payload: { taskId: taskId }
    });
  }

  // Close task editor panel
  const handleCloseTaskEditorPanel = () => dispatchTask({ type: TASK_ACTION.CLOSE_EDITOR_PANEL });

  // Toggle settings panel visibility
  const handleToggleSettingsPanel = () => setIsSettingsPanelOpen(!isSettingsPanelOpen);

  return (
    <div className='grid md:grid-cols-[auto,1fr,auto] h-screen w-screen bg-slate-100 overflow-hidden'>
      {/* list left panel */}
      <ListPanel
        isOpen={list.isPanelOpen} 
        listItems={list.listItems}
        selectedList={list.selectedItem}
        onCreateList={handleCreateList}
        onSelectList={handleSetSelectedList}
        onTogglePanel={handleToggleListPanel} 
        onToggleSettingsPanel={handleToggleSettingsPanel}
        onReorderListItems={handleUpdateListOrder}
      />

      {/* list editor popup */}
      <ListEditorPanel
        isOpen={list.isEditorPanelOpen}
        selectedList={list.selectedItem}
        onUpdateList={handleUpdateList}
        onCancelEdit={handleCloseListEditor}
      />

      {/* Settings panel */}
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onTogglePanel={handleToggleSettingsPanel}
      />

      {/* task middle panel */}
      <TaskPanel
        taskItems={task.taskItems}
        selectedList={list.selectedItem}
        selectedTask={task.selectedItem}
        onDeleteList={handleDeleteList}
        onCreateTask={handleCreateTask}
        onSelectTask={handleSetSelectedTask}
        onToggleTaskCompleteState={handleToggleTaskCompleteState}
        onToggleCompletedItemsVisibility={handleToggleCompletedItemsVisibility}
        onToggleListPanel={handleToggleListPanel}
        onToggleListEditorPanel={handleToggleListEditorPanel}
      />

      {/* task editor right panel */}
      <TaskEditorPanel
        isOpen={task.isEditorPanelOpen}
        selectedTask={task.selectedItem}
        selectedList={list.selectedItem}
        onTogglePanel={handleCloseTaskEditorPanel}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onToggleTaskCompleteState={handleToggleTaskCompleteState}
      />

      {/* app disclaimer */}
      <DisclaimerPanel />
    </div>
  );
}

export default App;
