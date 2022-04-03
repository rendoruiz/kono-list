import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

// components
import ListPanel from '../List/ListPanel';
import ListEditorPopup from '../List/ListEditorPopup';
import TaskPanel from '../Task/TaskPanel';
import TaskEditorPanel from '../Task/TaskEditorPanel';
// hooks, reducers, data
import useLocalState from '../../hooks/useLocalState';
import listReducer from '../../reducers/listReducer';
import taskReducer from '../../reducers/taskReducer';
import { listTemplate, initialListItems } from '../../data/list';
import { initialTaskItems } from '../../data/task';

const App = () => {
  // panel toggle states
  const [isListPanelOpen, setIsListPanelOpen] = React.useState(true);
  const [isListEditorPanelOpen, setIsListEditorPanelOpen] = React.useState(false);

  // panel toggle handlers
  const handleToggleListPanel = () => setIsListPanelOpen(!isListPanelOpen);
  const handleToggleListEditorPanel = () => setIsListEditorPanelOpen(!isListEditorPanelOpen);
  const handleCloseTaskEditorPanel = () => setSelectedTask(null);
  
  // list & task states
  const [selectedList, setSelectedList] = useLocalState('selected_list', initialListItems[0]);
  const [selectedTask, setSelectedTask] = useLocalState('selected_task', null);

  // list & task reducers
  const [listItems, dispatchListItems] = React.useReducer(
    listReducer,
    { 
      data: JSON.parse(localStorage.getItem('lists')) ?? initialListItems, 
      localKey: 'lists',
    }
  );
  const [taskItems, dispatchTaskItems] = React.useReducer(
    taskReducer,
    {
      data: JSON.parse(localStorage.getItem('tasks')) ?? initialTaskItems,
      localKey: 'tasks',
    }
  );

  // list - handlers
  // set selected list, reset selected task, close task editor panel
  const handleSelectList = (list) => {
    setSelectedList(list);
    setSelectedTask(null);
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
  // delete list templete, assign list before it as selected list, close list editor panel 
  const handleCancelCreateList = (event) => {
    dispatchListItems({
      type: 'LIST_DELETE',
      payload: { id: selectedList.id }
    });
    updateSelectedList(true);
    handleToggleListEditorPanel();
    event.preventDefault();
  }
  // update selected list with given name and badge, update selected list, close list editor panel
  const handleUpdateList = ({ name, badge }) => {
    dispatchListItems({
      type: 'LIST_UPDATE',
      payload: {
        ...selectedList,
        name: name.trim().length > 0 ? name : listTemplate.name,
        badge: badge.trim().length > 0 ? badge : listTemplate.badge,
      },
    });
    updateSelectedList();
    handleToggleListEditorPanel();
  }
  // delete selected list with prompt, assign list before is as selected list
  const handleDeleteList = (event) => {
    if (window.confirm(`Are you sure you want to delete this list: "${selectedList.name}"?`)) {
      dispatchListItems({
        type: 'LIST_DELETE',
        payload: { id: selectedList.id }
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

  // list - effects
  // makes sure the selected list object data is always up to date
  React.useEffect(() => {
    const index = listItems.data.findIndex((list) => list.id === selectedList.id);
    setSelectedList({...selectedList, ...listItems.data[index]});
  }, [listItems.data]);

  
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
        id: task.id,
        is_complete: !task.is_complete,
      }
    });
  }

  return (
    <div className='grid grid-cols-[auto,1fr,auto] h-screen w-screen bg-slate-100 overflow-hidden'>
      {/* list left panel */}
      <ListPanel
        isOpen={isListPanelOpen} 
        listItems={listItems.data}
        selectedList={selectedList}
        onToggleView={handleToggleListPanel} 
        onSelectList={handleSelectList}
        onCreateList={handleCreateList}
      />

      {/* list editor popup */}
      <ListEditorPopup
        isOpen={isListEditorPanelOpen}
        list={selectedList}
        onUpdateList={handleUpdateList}
        onCancelCreateList={handleCancelCreateList}
      />

      {/* task middle panel */}
      <TaskPanel
        taskItems={taskItems.data}
        selectedTask={selectedTask}
        selectedList={selectedList}
        onToggleTaskEditorPanel={handleToggleListEditorPanel}
        onSelectTask={handleSelectTask}
        onCreateTask={handleCreateTask}
        onToggleTaskCompleteState={handleToggleTaskCompleteState}
        onDeleteList={handleDeleteList}
        onToggleListHideCompletedState={handleToggleListHideCompletedState}
      />

      {/* task editor right panel */}
      <TaskEditorPanel
        task={selectedTask}
        onClosePanel={handleCloseTaskEditorPanel}
      />
    </div>
  );
}

export default App;