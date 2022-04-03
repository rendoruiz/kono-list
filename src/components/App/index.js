import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import ListPanel from '../List/ListPanel';
import ListEditorPopup from '../List/ListEditorPopup';
import useLocalState from '../../hooks/useLocalState';
import { listItemTemplate, initialListItems } from '../../data/listItem';
import { taskItemTemplate, initialTaskItems  } from '../../data/taskItem';
import listItemReducer from '../../reducers/listItemReducer';


const listItemRowsReducer = (state, action) => {
  let newState;

  switch(action.type) {
    case 'LIST_ITEM_CREATE':
      const newListItem = {
        ...taskItemTemplate,
        id: action.payload.id,
        list_id: action.payload.list_id,
        title: action.payload.title,
      };
      newState = { 
        ...state,
        data: [...state.data, newListItem],
      };
      break;
    case 'LIST_ITEM_UPDATE':
      newState = {
        ...state,
        data: state.data.map((listItem) => {
          if (listItem.id === action.payload.id) {
            return {
              ...listItem,
              list_id: action.payload.list_id ?? listItem.list_id,
              is_checked: action.payload.is_checked ?? listItem.is_checked,
              title: action.payload.title ?? listItem.title,
              note: action.payload.note ?? listItem.note,
              date_updated: Date.now(),
            }
          }
          return listItem;
        }),
    }
      break;
    case 'LIST_ITEM_DELETE':
      newState = {
        ...state,
        data: state.data.filter(
          (listItem) => listItem.id !== action.payload.id
        ),
      };
      break;
    default:
      throw new Error();
  }

  localStorage.setItem(state.localKey, JSON.stringify(newState.data));
  return newState;
}

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
    listItemRowsReducer,
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
      type: 'LIST_ITEM_CREATE',
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
      type: 'LIST_ITEM_UPDATE',
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
      <ListItemView
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


const ListItemView = ({ listItemRowsData, selectedListItemData, selectedListData, onToggleListEditView, onSelectListItem, onCreateListItem, onUpdateListItemCheckState, onDeleteList, onUpdateListCheckedItemState }) => (
  <div className='grid pt-2 max-h-screen'>
    <div className='relative grid grid-rows-[auto,1fr,auto] rounded-tl-xl px-10 overflow-scroll bg-blue-200'>
      <ListItemViewLists
        listItemRowsData={listItemRowsData}
        selectedListItemData={selectedListItemData}
        selectedListData={selectedListData}
        onSelectListItem={onSelectListItem}
        onUpdateListItemCheckState={onUpdateListItemCheckState}
        onUpdateListCheckedItemState={onUpdateListCheckedItemState}
      />
      
      <ListItemViewForm
        selectedListData={selectedListData}
        onCreateListItem={onCreateListItem}
      />

      <header className='-order-1 sticky top-0 flex items-center justify-between pt-10 pb-5 bg-blue-200/90'>
        {/* edit list */}
        <button 
          onClick={onToggleListEditView}
          title='Edit list'
          className='grid grid-cols-[auto,1fr] items-center rounded hover:bg-slate-500/40'
        >
          {/* list badge */}
          <div className='grid place-items-center w-10 h-10'>
            <span className='font-mono font-bold text-2xl leading-none'>
              {selectedListData?.badge ?? listItemTemplate.badge}
            </span>
          </div>
          {/* list name */}
          <h2 className='pl-1 pr-2 font-medium text-2xl text-left truncate'>
            {selectedListData?.name ?? listItemTemplate.name}
          </h2>
        </button>
        
        {/* delete list */}
        <button
          onClick={onDeleteList}
          title='Delete list'
          className='shrink-0 grid place-items-center rounded w-8 h-8 bg-white/50 hover:bg-white/80'
        >
          <span className='leading-none'>🗑️</span>
        </button>
      </header>
    </div>
  </div>
);

const ListItemViewLists = ({ listItemRowsData, selectedListItemData, selectedListData, onSelectListItem, onUpdateListItemCheckState, onUpdateListCheckedItemState }) => {
  const [checkedItems, setCheckedItems] = React.useState(null);
  const [uncheckedItems, setUncheckedItems] = React.useState(null);

  React.useEffect(() => {
    setCheckedItems(listItemRowsData.filter((listItem) => listItem.is_checked && listItem.list_id === selectedListData.id));
    setUncheckedItems(listItemRowsData.filter((listItem) => !listItem.is_checked && listItem.list_id === selectedListData.id));
  }, [listItemRowsData, selectedListData]);

  return (
    <main className=''>
      {/* debug list */}
      {/* <p className='mt-2 mb-3 font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(selectedListData).replaceAll(',"', ', "')}</p> */}

      {/* list item - unchecked */}
      <ul className='grid gap-[3px]'>
        {uncheckedItems && uncheckedItems.map((listItem) => (
          <ListItemViewRow
            key={listItem.id}
            data={listItem}
            selectedListItemData={selectedListItemData}
            onSelectListItem={onSelectListItem}
            onUpdateListItemCheckState={onUpdateListItemCheckState}
          />
        ))}
      </ul>

      {checkedItems?.length !== 0 && (<>
        {/* checked list item toggle */}
        <button 
          type='button'
          className='flex items-center rounded my-2 px-2 py-1 bg-white/50 text-sm hover:bg-white/80'
          onClick={onUpdateListCheckedItemState}
        >
          <span className={'px-1 scale-y-125 origin-center ' + (!selectedListData.is_checked_hidden ? 'rotate-90' : '')}>&gt;</span>
          <p className='ml-1 mr-2'>Completed</p>
          <span>{checkedItems?.length}</span>
        </button>
        {/* list item - checked */}
        {!selectedListData.is_checked_hidden && (
          <ul className='grid gap-[3px]'>
            {checkedItems && checkedItems.map((listItem) => (
              <ListItemViewRow
                key={listItem.id}
                data={listItem}
                selectedListItemData={selectedListItemData}
                onSelectListItem={onSelectListItem}
                onUpdateListItemCheckState={onUpdateListItemCheckState}
              />
            ))}
          </ul>
        )}
      </>)}
    </main>
  )
}

const ListItemViewRow = ({ data, selectedListItemData, onSelectListItem, onUpdateListItemCheckState }) => (
  <li className={
    'flex rounded-md cursor-pointer hover:bg-white/90 ' + 
    (data.id === selectedListItemData?.id ? 'bg-white' : 'bg-white/70')
  }>
    {/* <p className='mt-2 mb-3 font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(data).replaceAll(',"', ', "')}</p> */}

    {/* toggle is_checked */}
    <button
      type='button'
      title={data.is_checked ? 'Mark as incomplete' : 'Mark as complete'}
      onClick={() => onUpdateListItemCheckState(data)}
      className="group shrink-0 px-3 py-4 self-start"
    >
      {/* border */}
      <div className='group grid place-items-center w-[18px] h-[18px] border-2 border-slate-700 rounded-full'>
        {/* check mark */}
        <div className={
          'w-2 h-2 bg-slate-700/80 rounded-full transition-all group-hover:opacity-100 ' +
          (data.is_checked ? 'opacity-100 group-active:scale-50' : 'opacity-0 group-active:scale-150')
        } />
      </div>
    </button>

    {/* select list item */}
    <button
      type='button'
      title='Select list item'
      onClick={() => onSelectListItem(data)}
      className='flex-1 py-3 pr-2 text-sm text-left'
    >
      <p className={data.is_checked ? 'opacity-60 line-through' : ''}>{data?.title}</p>
    </button>
  </li>
);

const ListItemViewForm = ({ selectedListData, onCreateListItem }) => {
  const [input, setInput] = React.useState("");

  return (
    <footer className='sticky bottom-0 pt-2 pb-10 w-full bg-blue-200/90'>
      <form 
        className='relative overflow-hidden bg-blue-200'
        onSubmit={onCreateListItem}
        onReset={() => setInput("")}
      >
        {/* list item - title */}
        <input 
          name='title'
          type='text' 
          minLength={1}
          placeholder='Add a task'
          autoComplete='off'
          title={`Add a task in "${selectedListData.name}"`}
          className='peer rounded-md py-4 px-11 w-full bg-white/50 text-sm leading-none appearance-none outline-none placeholder:text-black/90 hover:bg-white/80 active:bg-white focus:bg-white'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* list item - unchecked state (decorative) */}
        <div className={'absolute inset-0 right-auto hidden items-center px-3 pointer-events-none peer-focus:grid ' + (input.length > 0 ? '!grid' : '')}>
          <div className='w-[18px] h-[18px] border-2 border-slate-700 rounded-full' />
        </div>

        {/* submit */}
        <button
          type='submit'
          title={input.trim().length > 0 ? 'Add new list item' : 'Invalid input'}
          className={'absolute inset-0 left-auto hidden px-2 cursor-pointer peer-focus:block ' + (input.trim().length > 0 ? '!block' : '!cursor-not-allowed')}
          disabled={input.trim().length < 1}
        >
          {/* <span>↑</span> */}
          <span className={'text-xl leading-none ' + (input.trim().length > 0 ? 'opacity-90' : 'opacity-30')}>⬆️</span> 
        </button>
      </form>
    </footer>
  )
}


const ListItemEditorView = ({ listItemData, isOpen, onToggleView }) => {
  return isOpen && (
    <div className='w-80 max-h-screen bg-green-300/30'>
      <p className='font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(listItemData)?.replaceAll(',"', ', "')}</p>
    </div>
  )
}

export default App;
