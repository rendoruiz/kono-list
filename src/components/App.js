/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import * as React from 'react';

import { v4 as uuidv4 } from 'uuid';

// components
import ListPanel from './List/ListPanel';
import ListEditorPopup from './List/ListEditorPopup';
import TaskPanel from './Task/TaskPanel';
import TaskEditorPanel from './Task/TaskEditorPanel';
// hooks, reducers, data, utils
import useLocalState from '../hooks/useLocalState';
import listReducer from '../reducers/listReducer';
import taskReducer from '../reducers/taskReducer';
import { listTemplate, initialListItems } from '../data/list';
import { initialTaskItems } from '../data/task';
import { decryptObject } from '../utils/cryptoJs';
import SettingsPanel from './SettingsPanel';

// for pwa install button
let deferredPrompt; 

const App = () => {
  // panel toggle states
  const [isListPanelOpen, setIsListPanelOpen] = useLocalState('ilpo', true);
  const [isListEditorPanelOpen, setIsListEditorPanelOpen] = React.useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = React.useState(false);

  // list & task states
  const [selectedList, setSelectedList] = useLocalState('sl', initialListItems[0]);
  const [selectedTask, setSelectedTask] = useLocalState('st', null);

  // pwa install button state
  const [isInstallable, setIsInstallable] = React.useState(false);

  // list & task reducers
  const [listItems, dispatchListItems] = React.useReducer(
    listReducer,
    { 
      data: decryptObject(localStorage.getItem('ls')) ?? initialListItems, 
      localKey: 'ls',
    }
  );
  const [taskItems, dispatchTaskItems] = React.useReducer(
    taskReducer,
    {
      data: decryptObject(localStorage.getItem('ts')) ?? initialTaskItems,
      localKey: 'ts',
    }
  );
  
  // list & task - effects
  // makes sure the selected list & task object data is always up to date
  React.useEffect(() => {
    if (selectedList) {
      setSelectedList(listItems.data.find((list) => list.id === selectedList.id));
    }
  }, [listItems.data, selectedList, setSelectedList]);
  React.useEffect(() => {
    if (selectedTask) {
      setSelectedTask(taskItems.data.find((task) => task.id === selectedTask.id));
    }
  }, [taskItems.data, selectedTask, setSelectedTask]);

  // pwa install button effect
  // prevent install prompt from appearing and capture its event for later use
  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setIsInstallable(true);
    });
  }, []);

  // panel toggle handlers
  const handleToggleListPanel = () => setIsListPanelOpen(!isListPanelOpen);
  const handleToggleListEditorPanel = () => setIsListEditorPanelOpen(!isListEditorPanelOpen);
  const handleCloseTaskEditorPanel = () => setSelectedTask(null);
  const handleToggleSettingsPanel = () => setIsSettingsPanelOpen(!isSettingsPanelOpen);

  // pwa install button handler
  // toggle isinstallable flag and show the captured prompt from useeffect
  const handleInstallApp = () => {
    setIsInstallable(false);
    deferredPrompt.prompt();
  }

  // list - handlers
  // set selected list, reset selected task, close task editor panel
  const handleSelectList = (list) => {
    setSelectedList(list);
    setSelectedTask(null);
    setIsListPanelOpen(false);
  }
  // create id, create list template, assign as selected list, close list editor panel
  const handleCreateList = () => {
    const newListId = uuidv4();
    dispatchListItems({
      type: 'LIST_CREATE',
      payload: { id: newListId }
    });
    setSelectedList({ id: newListId });
    handleToggleListEditorPanel();
  }
  // delete list & assign list before it as selected list if its newly created
  // close list editor panel afterwards
  const handleListEditorCancelEdit = (event) => {
    if (!selectedList.date_updated) {
      dispatchListItems({
        type: 'LIST_DELETE',
        payload: { id: selectedList.id }
      });
      updateSelectedList(true);
    }
    handleToggleListEditorPanel();
    event.preventDefault();
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

  // clear localstorage + reroute to page origin
  const handleResetCache = (event) => {
    if (window.confirm('Are you sure you want to reset everything back to default?')) {
      localStorage.clear();
      window.location.assign(window.location.origin);
    }
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
      <ListEditorPopup
        isOpen={isListEditorPanelOpen}
        list={selectedList}
        onUpdateList={handleUpdateList}
        onCancelEdit={handleListEditorCancelEdit}
      />

      {/* Settings panel */}
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        isInstallable={isInstallable}
        onTogglePanel={handleToggleSettingsPanel}
        onInstallApp={handleInstallApp}
        onResetCache={handleResetCache}
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
    </div>
  );
}

export default App;
