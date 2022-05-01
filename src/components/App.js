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
  const handleListEditorCancelEdit = () => {
    if (list.selectedItem.date_updated) {
      dispatchList({
        type: LIST_ACTION.DELETE_ITEM,
        payload: { listId: list.selectedItem },
      });
    }
    dispatchList({ type: LIST_ACTION.TOGGLE_EDITOR_PANEL });
  }

  // update selected list with given name and icon, update selected list, close list editor panel
  // close task editor if list is newly created
  const handleUpdateList = ({ name, icon }) => {
    if (selectedList && (selectedList.locked || selectedList.id < 5)) {
      alert('Cannot update locked list.');
      setIsListEditorPanelOpen(false);
      return;
    }
    dispatchListItems({
      type: 'LIST_UPDATE',
      payload: {
        ...selectedList,
        name: name.trim().length > 0 ? name.trim() : listTemplate.name,
        icon: icon,
      },
    });
    updateSelectedList();
    handleToggleListEditorPanel();
    if (!selectedList.date_updated) {
      setSelectedTask(null);
      setIsListPanelOpen(false);
    }
  }
  // delete selected list and its tasks with prompt, assign list before is as selected list
  const handleDeleteList = (event) => {
    if (selectedList && (selectedList.locked || selectedList.id < 5)) {
      alert('Cannot delete locked list.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete this list: "${selectedList.name}"?`)) {
      dispatchListItems({
        type: 'LIST_DELETE',
        payload: { id: selectedList.id },
      });
      dispatchTaskItems({
        type: 'LIST_TASKS_DELETE',
        payload: { list_id: selectedList.id },
      });
      updateSelectedList(true);
    }
    event.preventDefault();
  }
  // refreshes selected list data.
  const updateSelectedList = (goBackward = false) => {
    const index = listItems.data.findIndex((list) => list.id === selectedList.id);
    const newdata = listItems.data[index - (goBackward ? 1 : 0)];
    setSelectedList({...selectedList, ...newdata});
  }
  // toggle is_completed_hidden boolean value of a list
  const handleToggleListHideCompletedState = () => {
    dispatchListItems({
      type: 'LIST_UPDATE',
      payload: {
        id: selectedList.id,
        is_completed_hidden: !selectedList.is_completed_hidden,
      }
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
        onCancelEdit={handleListEditorCancelEdit}
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
        onToggleListHideCompletedState={handleToggleListHideCompletedState}
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
