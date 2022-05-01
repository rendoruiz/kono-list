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
import useLocalState from '../hooks/useLocalState';
import { listReducer, LIST_ACTION } from '../reducers/listReducer';
import taskReducer from '../reducers/taskReducer';
import { listTemplate, initialListItems } from '../data/list';
import { initialTaskItems } from '../data/task';
import { decryptObject } from '../utils/cryptoJs';


const storedList = JSON.parse(localStorage.getItem('list'));
const storedTask = JSON.parse(localStorage.getItem('task'));

const App = () => {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = React.useState(false);

  const [list, dispatchList] = React.useReducer(
    listReducer,
    { 
      listItems: storedList?.listItems ?? initialListItems, 
      selectedItem: storedList?.selectedItem ?? initialListItems[0],
      isPanelOpen: storedList?.isPanelOpen ?? true,
      isEditorPanelOpen: false,
    }
  );
  const [task, dispatchTask] = React.useReducer(
    taskReducer,
    {
      taskItems: decryptObject(localStorage.getItem('ts')) ?? initialTaskItems,
      selectedTask: storedTask?.selectedTask,
      isEditorPanelOpen: false,
    }
  );
  
  
  React.useEffect(() => {
    // store data to localstorage
    console.log(list);
  }, [list]);

  React.useEffect(() => {
    // store data to localstorage
    console.log(task);
  }, [task]);


  // Set selected list
  // Close list panel (mobile)
  // Close task editor
  const handleSelectList = (listId) => {
    dispatchList({
      type: LIST_ACTION.SELECT_ITEM,
      payload: { listId: listId },
    });
    // close task editor
  }

  // Create new list item
  // Use the new list item as selected list
  // Close list editor panel
  const handleCreateList = () => {
    const newListId = uuidv4();
    dispatchList({
      type: LIST_ACTION.CREATE_ITEM,
      payload: { listId: newListId },
    });
  }

  // (if new list) Delete recently created list item
  // (if new list) Assign the previous list as the selected list
  // Close list editor panel 
  const handleCloseListEditor = () => {
    if (list.selectedItem.date_updated) {
      dispatchList({
        type: LIST_ACTION.DELETE_ITEM,
        payload: { listId: list.selectedItem },
      });
    }
    dispatchList({ type: LIST_ACTION.TOGGLE_EDITOR_PANEL });
  }

  // Update list
  // Set new selected list
  // Close list editor panel
  // (if new list) Close task editor
  const handleUpdateList = (listItem) => {
    if (list.selectedItem.locked || list.selectedItem.id < 5) {
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
      // close task editor
    }
  }

  // Delete selected list
  // Delete all tasks associated with selected list
  // Assign the previous list as the selected list
  const handleDeleteList = () => {
    if (list.selectedItem.locked || list.selectedItem.id < 5) {
      alert('Cannot delete locked list.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete this list: "${list.selectedItem.name}"?`)) {
      dispatchList({
        type: LIST_ACTION.DELETE_ITEM,
        payload: { listId: list.selectedItem.id },
      });
      // delete task items with list id
    }
  }

  // Toggle visibility of completed items within a list
  const handleToggleCompletedItemsVisibility = () => {
    dispatchList({
      type: LIST_ACTION.TOGGLE_COMPLETED_ITEMS_VISIBILITY,
      payload: { listId: list.selectedItem.id },
    });
  }
  
  // task - handlers
  // remove selected task & close task editor panel if the newly selected task is the same
  // else, assign newly selected task as the selected task & close editor panel
  const handleSelectTask = (task) => {
    if (selectedTask && task.id === selectedTask.id) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  }
  // create id, create new task with given data, reset form fields, close task editor, remove selected task
  const handleCreateTask = (event) => {
    const newListItemId = uuidv4();
    dispatchTaskItems({
      type: 'TASK_CREATE',
      payload: {
        id: newListItemId,
        list_id: selectedList.id,
        title: event.target.title.value,
      }
    });
    setSelectedTask(null);
    event.target.reset();
    event.preventDefault();
  }
  // toggle is_complete boolean value of a task
  const handleToggleTaskCompleteState = (task) => {
    dispatchTaskItems({
      type: 'TASK_UPDATE',
      payload: {
        ...selectedTask,
        id: task.id,
        is_complete: !task.is_complete,
      }
    });
  }
  // update a task's title and note
  const handleUpdateTask = ({ title, note }) => {
    dispatchTaskItems({
      type: 'TASK_UPDATE',
      payload: {
        ...selectedTask,
        title: title?.trim().length > 0 ? title?.trim() : selectedTask.title,
        note: note?.trim(),
      },
    });
  }
  // delete a task based on the selected task id
  const handleDeleteTask = (event) => {
    dispatchTaskItems({
      type: 'TASK_DELETE',
      payload: { id: selectedTask.id },
    });
    setSelectedTask(null);
    event.preventDefault();
  }


  return (
    <div className='grid md:grid-cols-[auto,1fr,auto] h-screen w-screen bg-slate-100 overflow-hidden'>
      {/* list left panel */}
      <ListPanel
        isOpen={isListPanelOpen} 
        listItems={listItems.data}
        selectedList={selectedList}
        onTogglePanel={handleToggleListPanel} 
        onSelectList={handleSelectList}
        onCreateList={handleCreateList}
        onToggleSettingsPanel={handleToggleSettingsPanel}
      />

      {/* list editor popup */}
      <ListEditorPanel
        isOpen={isListEditorPanelOpen}
        list={selectedList}
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
        taskItems={taskItems.data}
        selectedTask={selectedTask}
        selectedList={selectedList}
        onSelectTask={handleSelectTask}
        onCreateTask={handleCreateTask}
        onToggleTaskCompleteState={handleToggleTaskCompleteState}
        onDeleteList={handleDeleteList}
        onToggleListPanel={handleToggleListPanel}
        onToggleListEditorPanel={handleToggleListEditorPanel}
        onToggleListHideCompletedState={handleToggleCompletedItemsVisibility}
      />

      {/* task editor right panel */}
      <TaskEditorPanel
        task={selectedTask}
        selectedList={selectedList}
        onClosePanel={handleCloseTaskEditorPanel}
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
