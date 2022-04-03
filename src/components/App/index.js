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
  // view toggle states
  const [isListPanelOpen, setIsListPanelOpen] = React.useState(true);
  const [isListEditorPanelOpen, setIsListEditorPanelOpen] = React.useState(false);
  const [isTaskEditorPanelOpen, setIsTaskEditorPanelOpen] = useLocalState('is_task_editor_open', false);

  // view toggle handlers
  const handleToggleListPanel = () => setIsListPanelOpen(!isListPanelOpen);
  const handleToggleListEditorPanel = () => setIsListEditorPanelOpen(!isListEditorPanelOpen);
  const handleToggleTaskEditorPanel = () => setIsTaskEditorPanelOpen(!isTaskEditorPanelOpen);
  
  // list - reducers
  const [listItems, dispatchListItems] = React.useReducer(
    listItemReducer,
    { 
      data: JSON.parse(localStorage.getItem('lists')) ?? initialListItems, 
      localKey: 'lists',
    }
  );

  // list - states
  const [selectedListData, setSelectedListData] = useLocalState('selected_list', initialListItems[0]);

  // list - handlers
  const handleSelectList = (listData) => {
    setSelectedListData(listData);
    // reset list item selection & close editor
    setSelectedListItemData(null);
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

    setSelectedListData({ id: newListId });
    handleToggleListEditorPanel();
  }
  const handleCancelCreateList = (event) => {
    // delete recently created list
    dispatchListItems({
      type: 'LIST_DELETE',
      payload: { id: selectedListData.id }
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
        ...selectedListData,
        name: name.trim().length > 0 ? name : listItemTemplate.name,
        badge: badge.trim().length > 0 ? badge : listItemTemplate.badge,
      },
    });

    // close editor
    setCompletedSelectedListData();
    handleToggleListEditorPanel();
  }
  const handleDeleteList = (event) => {
    if (window.confirm(`Are you sure you want to delete this list: "${selectedListData.name}"?`)) {
      dispatchListItems({
        type: 'LIST_DELETE',
        payload: { id: selectedListData.id }
      });
      setCompletedSelectedListData(true);
    }
    // assign the list before the recently created list as the selected list
    event.preventDefault();
  }
  const setCompletedSelectedListData = (goBackward = false) => {
    const index = listItems.data.findIndex((list) => list.id === selectedListData.id);
    const newdata = listItems.data[index - (goBackward ? 1 : 0)]
    setSelectedListData({...selectedListData, ...newdata});
    // setSelectedListId(listItems.data[selectedListIndex - (goBackward ? 1 : 0)])
  }
  const handleUpdateListCheckedItemState = () => {
    dispatchListItems({
      type: 'LIST_UPDATE',
      payload: {
        id: selectedListData.id,
        is_checked_hidden: !selectedListData.is_checked_hidden,
      }
    });
  }

  // list - effects
  React.useEffect(() => {
    // keep selectedlistdata up to date with listrows record it is referencing.
    const index = listItems.data.findIndex((list) => list.id === selectedListData.id);
    setSelectedListData({...selectedListData, ...listItems.data[index]});
  }, [listItems.data]);


  // list item - reducers
  const [listItemRows, dispatchListItemRows] = React.useReducer(
    taskItemReducer,
    {
      data: JSON.parse(localStorage.getItem('list_items')) ?? initialTaskItems,
      localKey: 'list_items',
    }
  );

  // list item - states
  const [selectedListItemData, setSelectedListItemData] = useLocalState('selected_list_item', initialTaskItems[0]);
  
  // list item - handlers
  const handleSelectListItem = (listItemData) => {
    if (selectedListItemData && listItemData.id === selectedListItemData.id) {
      setSelectedListItemData(null);
    setIsTaskEditorPanelOpen(false);
    } else {
      setSelectedListItemData(listItemData);
      setIsTaskEditorPanelOpen(true);
    }
  }
  const handleCreateListItem = (event) => {
    const newListItemId = uuidv4();
    dispatchListItemRows({
      type: 'TASK_CREATE',
      payload: {
        id: newListItemId,
        list_id: selectedListData.id,
        title: event.target.title.value,
      }
    });
    // reset form fields
    event.target.reset();

    // close list item editor and deselect current list item
    setIsTaskEditorPanelOpen(false);
    setSelectedListItemData(null);
    event.preventDefault();
  }
  const handleUpdateListItemCheckState = (listItemData) => {
    dispatchListItemRows({
      type: 'TASK_UPDATE',
      payload: {
        id: listItemData.id,
        is_checked: !listItemData.is_checked,
      }
    });
  }

  // list item - effects

  return (
    <div className='grid grid-cols-[auto,1fr,auto] h-screen w-screen bg-slate-100 overflow-hidden'>
      {/* list view */}
      <ListPanel
        isOpen={isListPanelOpen} 
        listRowsData={listItems.data}
        selectedListData={selectedListData}
        onToggleView={handleToggleListPanel} 
        onSelectList={handleSelectList}
        onCreateList={handleCreateList}
      />

      {/* list row editor popup */}
      <ListEditorPopup
        isOpen={isListEditorPanelOpen}
        listData={selectedListData}
        onUpdateList={handleUpdateList}
        onCancelCreate={handleCancelCreateList}
      />

      {/* list item view */}
      <TaskPanel
        listItemRowsData={listItemRows.data}
        selectedListItemData={selectedListItemData}
        selectedListData={selectedListData}
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
        listItemData={selectedListItemData}
        onToggleView={handleToggleTaskEditorPanel}
      />
    </div>
  );
}

export default App;
