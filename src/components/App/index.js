import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
// components
import ListPanel from '../List/ListPanel';
import ListEditorPopup from '../List/ListEditorPopup';
import TaskPanel from '../Task/TaskPanel';
import TaskEditorPanel from '../Task/TaskEditorPanel';
// hooks, reducers, data
import useLocalState from '../../hooks/useLocalState';
import listItemReducer from '../../reducers/listItemReducer';
import taskItemReducer from '../../reducers/taskItemReducer';
import { listItemTemplate, initialListItems } from '../../data/listItem';
import { initialTaskItems  } from '../../data/taskItem';

const App = () => {
  // panel toggle states
  const [isListPanelOpen, setIsListPanelOpen] = React.useState(true);
  const [isListEditorPanelOpen, setIsListEditorPanelOpen] = React.useState(false);
  const [isTaskEditorPanelOpen, setIsTaskEditorPanelOpen] = useLocalState('is_task_editor_open', false);

  // panel toggle handlers
  const handleToggleListPanel = () => setIsListPanelOpen(!isListPanelOpen);
  const handleToggleListEditorPanel = () => setIsListEditorPanelOpen(!isListEditorPanelOpen);
  const handleToggleTaskEditorPanel = () => setIsTaskEditorPanelOpen(!isTaskEditorPanelOpen);
  
  // list & task states
  const [selectedList, setSelectedList] = useLocalState('selected_list', initialListItems[0]);
  const [selectedTask, setSelectedTask] = useLocalState('selected_task', initialTaskItems[0]);

  // list & task reducers
  const [listItems, dispatchListItems] = React.useReducer(
    listItemReducer,
    { 
      data: JSON.parse(localStorage.getItem('lists')) ?? initialListItems, 
      localKey: 'lists',
    }
  );
  const [taskItems, dispatchTaskItems] = React.useReducer(
    taskItemReducer,
    {
      data: JSON.parse(localStorage.getItem('tasks')) ?? initialTaskItems,
      localKey: 'tasks',
    }
  );

  // list - handlers
  const handleSelectList = (listData) => {
    setSelectedList(listData);
    // reset list item selection & close editor
    setSelectedTask(null);
    setIsTaskEditorPanelOpen(false);
  }
  const handleCreateList = () => {
    // create unique id and create temp list
    const newListId = uuidv4();
    dispatchListItems({
      type: 'LIST_CREATE',
      payload: { id: newListId }
    });
    // set created id as selected list and close editor
    setSelectedList({ id: newListId });
    handleToggleListEditorPanel();
  }
  const handleCancelCreateList = (event) => {
    // delete recently created list
    dispatchListItems({
      type: 'LIST_DELETE',
      payload: { id: selectedList.id }
    });
    // assign the list before the recently created list as the selected list
    setCompletedSelectedListData(true);
    // close list editor
    handleToggleListEditorPanel();
    event.preventDefault();
  }
  const handleUpdateList = ({ name, badge }) => {
    dispatchListItems({
      type: 'LIST_UPDATE',
      payload: {
        ...selectedList,
        name: name.trim().length > 0 ? name : listItemTemplate.name,
        badge: badge.trim().length > 0 ? badge : listItemTemplate.badge,
      },
    });

    // close editor
    setCompletedSelectedListData();
    handleToggleListEditorPanel();
  }
  const handleDeleteList = (event) => {
    if (window.confirm(`Are you sure you want to delete this list: "${selectedList.name}"?`)) {
      dispatchListItems({
        type: 'LIST_DELETE',
        payload: { id: selectedList.id }
      });
      setCompletedSelectedListData(true);
    }
    // assign the list before the recently created list as the selected list
    event.preventDefault();
  }
  const setCompletedSelectedListData = (goBackward = false) => {
    const index = listItems.data.findIndex((list) => list.id === selectedList.id);
    const newdata = listItems.data[index - (goBackward ? 1 : 0)]
    setSelectedList({...selectedList, ...newdata});
    // setSelectedListId(listItems.data[selectedListIndex - (goBackward ? 1 : 0)])
  }
  const handleUpdateListCheckedItemState = () => {
    dispatchListItems({
      type: 'LIST_UPDATE',
      payload: {
        id: selectedList.id,
        is_completed_hidden: !selectedList.is_completed_hidden,
      }
    });
  }

  // list - effects
  React.useEffect(() => {
    // keep selectedlistdata up to date with listrows record it is referencing.
    const index = listItems.data.findIndex((list) => list.id === selectedList.id);
    setSelectedList({...selectedList, ...listItems.data[index]});
  }, [listItems.data]);


  
  // list item - handlers
  const handleSelectListItem = (listItemData) => {
    if (selectedTask && listItemData.id === selectedTask.id) {
      setSelectedTask(null);
    setIsTaskEditorPanelOpen(false);
    } else {
      setSelectedTask(listItemData);
      setIsTaskEditorPanelOpen(true);
    }
  }
  const handleCreateListItem = (event) => {
    const newListItemId = uuidv4();
    dispatchTaskItems({
      type: 'TASK_CREATE',
      payload: {
        id: newListItemId,
        list_id: selectedList.id,
        title: event.target.title.value,
      }
    });
    // reset form fields
    event.target.reset();

    // close list item editor and deselect current list item
    setIsTaskEditorPanelOpen(false);
    setSelectedTask(null);
    event.preventDefault();
  }
  const handleUpdateListItemCheckState = (listItemData) => {
    dispatchTaskItems({
      type: 'TASK_UPDATE',
      payload: {
        id: listItemData.id,
        is_complete: !listItemData.is_complete,
      }
    });
  }

  // list item - effects

  return (
    <div className='grid grid-cols-[auto,1fr,auto] h-screen w-screen bg-slate-100 overflow-hidden'>
      {/* list view */}
      <ListPanel
        isOpen={isListPanelOpen} 
        listItems={listItems.data}
        selectedList={selectedList}
        onToggleView={handleToggleListPanel} 
        onSelectList={handleSelectList}
        onCreateList={handleCreateList}
      />

      {/* list row editor popup */}
      <ListEditorPopup
        isOpen={isListEditorPanelOpen}
        list={selectedList}
        onUpdateList={handleUpdateList}
        onCancelCreate={handleCancelCreateList}
      />

      {/* list item view */}
      <TaskPanel
        taskItems={taskItems.data}
        selectedTask={selectedTask}
        selectedList={selectedList}
        onToggleListEditView={handleToggleListEditorPanel}
        onSelectListItem={handleSelectListItem}
        onCreateListItem={handleCreateListItem}
        onUpdateListItemCheckState={handleUpdateListItemCheckState}
        onDeleteList={handleDeleteList}
        onUpdateListCheckedItemState={handleUpdateListCheckedItemState}
      />

      {/* list item editor view */}
      <TaskEditorPanel
        isOpen={isTaskEditorPanelOpen}
        listItemData={selectedTask}
        onToggleView={handleToggleTaskEditorPanel}
      />
    </div>
  );
}

export default App;
