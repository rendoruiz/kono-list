/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import * as React from 'react';

// components
import List from './List/List';
import Task from './Task/Task';
import AppNoticePanel from './AppNoticePanel';
import AppSettingsPanel from './AppSettingsPanel';
// hooks, reducers, data, utils
import { listReducer, LIST_ACTION, defaultList } from '../reducers/listReducer';
import { taskReducer, defaultTask } from '../reducers/taskReducer';
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

  // Toggle list panel (sidebar) visibility
  const handleToggleListPanel = () => dispatchList({ type: LIST_ACTION.TOGGLE_PANEL });

  // Toggle settings panel visibility
  const handleToggleAppSettings = () => setIsSettingsPanelOpen(!isSettingsPanelOpen);

  return (
    <div className='grid md:grid-cols-[auto,1fr,auto] h-screen w-screen bg-slate-100 overflow-hidden'>
      <List
        list={list}
        dispatchList={dispatchList}
        dispatchTask={dispatchTask}
        onToggleListPanel={handleToggleListPanel}
        onToggleAppSettings={handleToggleAppSettings}
      />
      <Task
        task={task}
        dispatchTask={dispatchTask}
        selectedList={list.selectedItem}
        dispatchList={dispatchList}
        onToggleListPanel={handleToggleListPanel}
      />
      <AppNoticePanel />
      <AppSettingsPanel
        isOpen={isSettingsPanelOpen}
        onToggle={handleToggleAppSettings}
      />
    </div>
  );
}

export default App;
