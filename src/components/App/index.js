import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import ListPanel from '../List/ListPanel';
import ListEditorPopup from '../List/ListEditorPopup';
import useLocalState from '../../hooks/useLocalState';
import listItemReducer from '../../reducers/listItemReducer';
import taskItemReducer from '../../reducers/taskItemReducer';
import { listItemTemplate, initialListItems } from '../../data/listItem';
import { initialTaskItems  } from '../../data/taskItem';
import TaskPanel from '../Task/TaskPanel';

const App = () => {
  // view toggle states
  const [isListViewOpen, setIsListViewOpen] = React.useState(true);
  const [isListEditorViewOpen, setIsListEditorViewOpen] = React.useState(false);
  const [isListItemEditorViewOpen, setIsListItemEditorViewOpen] = useLocalState('isListItemEditorViewOpen', false);

  // view toggle handlers
  const handleToggleListView = () => setIsListViewOpen(!isListViewOpen);
  const handleToggleListEditorView = () => setIsListEditorViewOpen(!isListEditorViewOpen);
  const handleToggleListItemEditorView = () => setIsListItemEditorViewOpen(!isListItemEditorViewOpen);
  
  // list - reducers
  const [listRows, dispatchListRows] = React.useReducer(
    listItemReducer,
    { 
      data: JSON.parse(localStorage.getItem('list_items')) ?? initialListItems, 
      localKey: 'list_items',
    }
  );

  // list - states
  const [selectedListData, setSelectedListData] = useLocalState('selected_list', initialListItems[0]);

  // list - handlers
  const handleSelectList = (listData) => {
    setSelectedListData(listData);
    // reset list item selection & close editor
    setSelectedListItemData(null);
    setIsListItemEditorViewOpen(false);
  }
  const handleCreateList = () => {
    // create unique id and create temp list
    const newListId = uuidv4();
    dispatchListRows({
      type: 'LIST_CREATE',
      payload: { id: newListId }
    });
    // set created id as selected list and close editor

    setSelectedListData({ id: newListId });
    handleToggleListEditorView();
  }
  const handleCancelCreateList = (event) => {
    // delete recently created list
    dispatchListRows({
      type: 'LIST_DELETE',
      payload: { id: selectedListData.id }
    });
    // assign the list before the recently created list as the selected list
    setCompletedSelectedListData(true);
    // close list editor
    handleToggleListEditorView();
    event.preventDefault();
  }
  const handleUpdateList = ({ name, badge }) => {
    dispatchListRows({
      type: 'LIST_UPDATE',
      payload: {
        ...selectedListData,
        name: name.trim().length > 0 ? name : listItemTemplate.name,
        badge: badge.trim().length > 0 ? badge : listItemTemplate.badge,
      },
    });

    // close editor
    setCompletedSelectedListData();
    handleToggleListEditorView();
  }
  const handleDeleteList = (event) => {
    if (window.confirm(`Are you sure you want to delete this list: "${selectedListData.name}"?`)) {
      dispatchListRows({
        type: 'LIST_DELETE',
        payload: { id: selectedListData.id }
      });
      setCompletedSelectedListData(true);
    }
    // assign the list before the recently created list as the selected list
    event.preventDefault();
  }
  const setCompletedSelectedListData = (goBackward = false) => {
    const index = listRows.data.findIndex((list) => list.id === selectedListData.id);
    const newdata = listRows.data[index - (goBackward ? 1 : 0)]
    setSelectedListData({...selectedListData, ...newdata});
    // setSelectedListId(listRows.data[selectedListIndex - (goBackward ? 1 : 0)])
  }
  const handleUpdateListCheckedItemState = () => {
    dispatchListRows({
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
    const index = listRows.data.findIndex((list) => list.id === selectedListData.id);
    setSelectedListData({...selectedListData, ...listRows.data[index]});
  }, [listRows.data]);


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
    setIsListItemEditorViewOpen(false);
    } else {
      setSelectedListItemData(listItemData);
      setIsListItemEditorViewOpen(true);
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
    setIsListItemEditorViewOpen(false);
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
        isOpen={isListViewOpen} 
        listRowsData={listRows.data}
        selectedListData={selectedListData}
        onToggleView={handleToggleListView} 
        onSelectList={handleSelectList}
        onCreateList={handleCreateList}
      />

      {/* list row editor popup */}
      <ListEditorPopup
        isOpen={isListEditorViewOpen}
        listData={selectedListData}
        onUpdateList={handleUpdateList}
        onCancelCreate={handleCancelCreateList}
      />

      {/* list item view */}
      <TaskPanel
        listItemRowsData={listItemRows.data}
        selectedListItemData={selectedListItemData}
        selectedListData={selectedListData}
        onToggleListEditView={handleToggleListEditorView}
        onSelectListItem={handleSelectListItem}
        onCreateListItem={handleCreateListItem}
        onUpdateListItemCheckState={handleUpdateListItemCheckState}
        onDeleteList={handleDeleteList}
        onUpdateListCheckedItemState={handleUpdateListCheckedItemState}
      />

      {/* list item editor view */}
      <ListItemEditorView
        isOpen={isListItemEditorViewOpen}
        listItemData={selectedListItemData}
        onToggleView={handleToggleListItemEditorView}
      />
    </div>
  );
}



const ListItemEditorView = ({ listItemData, isOpen, onToggleView }) => {
  return isOpen && (
    <div className='w-80 max-h-screen bg-green-300/30'>
      <p className='font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(listItemData)?.replaceAll(',"', ', "')}</p>
    </div>
  )
}

export default App;
