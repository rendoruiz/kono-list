import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

const useLocalState = (key, initialState) => {
  const [value, setValue] = React.useState(
    JSON.parse(localStorage.getItem(key)) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

const initialListRows = [
  {
    id: 0,
    name: "Tasks",
    date_created: Date.now(),
    date_updated: null,
    badge: "⭐",
  },
];

const defaultListRow = {
  id: null,
  name: 'Untitled list',
  badge: '📃',
  date_created: Date.now(),
  date_updated: null,
}

const listRowsReducer = (state, action) => {
  let newState;

  switch(action.type) {
    case 'LIST_CREATE':
      const newList = {
        ...defaultListRow,
        id: action.payload.id,
      };
      newState = { 
        ...state,
        data: [...state.data, newList],
      };
      break;
    case 'LIST_UPDATE':
      newState = {
        ...state,
        data: state.data.map((list) => {
          if (list.id === action.payload.id) {
            return {
              ...list,
              name: action.payload.name ?? list.name,
              badge: action.payload.badge ?? list.badge,
              date_updated: Date.now(),
            }
          }
          return list;
        }),
    }
      break;
    case 'LIST_DELETE':
      newState = {
        ...state,
        data: state.data.filter(
          (list) => list.id !== action.payload.id
        ),
      };
      break;
    default:
      throw new Error();
  }

  localStorage.setItem(state.localKey, JSON.stringify(newState.data));
  return newState;
}

const defaultListItemRow = {
  id: null,
  list_id: null,
  is_checked: false,
  date_created: Date.now(),
  date_updated: null,
  title: null,
  description: null,
}

const initialListItemRows = [
  {
    id: 0,
    list_id: 0,
    is_checked: false,
    date_created: Date.now(),
    date_updated: null,
    title: 'List Item 1',
    description: 'List Item 1 description',
  },
  {
    id: 1,
    list_id: 0,
    is_checked: true,
    date_created: Date.now(),
    date_updated: null,
    title: 'List Item 2',
    description: 'List Item 2 description',
  },
  {
    id: 2,
    list_id: 0,
    is_checked: false,
    date_created: Date.now(),
    date_updated: null,
    title: 'List Item 3',
    description: 'List Item 3 description',
  },
];

const listItemRowsReducer = (state, action) => {
  let newState;

  switch(action.type) {
    case 'LIST_ITEM_CREATE':
      const newListItem = {
        ...defaultListItemRow,
        id: action.payload.id,
        list_id: action.payload.list_id,
        is_checked: action.payload.is_checked,
        title: action.payload.title,
        description: action.payload.description,
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
              description: action.payload.description ?? listItem.description,
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
    listRowsReducer,
    { 
      data: JSON.parse(localStorage.getItem('lists')) ?? initialListRows, 
      localKey: 'lists',
    }
  );

  // list - states
  const [selectedListData, setSelectedListData] = useLocalState('selected_list', initialListRows[0]);

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
  const handleUpdateList = (event) => {
    const { name, badge } = event.target;
    dispatchListRows({
      type: 'LIST_UPDATE',
      payload: {
        ...selectedListData,
        name: name?.value ? name.value : null,
        badge: badge?.value ? badge.value : null,
      },
    });

    // close editor
    setCompletedSelectedListData();
    handleToggleListEditorView();
    event.preventDefault();
  }
  const handleDeleteList = (event) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
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
      data: JSON.parse(localStorage.getItem('list_items')) ?? initialListItemRows,
      localKey: 'list_items',
    }
  );

  // list item - states
  const [selectedListItemData, setSelectedListItemData] = useLocalState('selected_list_item', initialListItemRows[0]);
  
  // list item - handlers
  const handleSelectListItem = (listItemData) => setSelectedListItemData(listItemData);

  // list item - effects
  

  return (
    <div className='grid grid-cols-[auto,1fr,auto] h-screen w-screen bg-slate-100 overflow-hidden'>
      {/* list view */}
      <ListView 
        isOpen={isListViewOpen} 
        listRowsData={listRows.data}
        selectedListData={selectedListData}
        onToggleView={handleToggleListView} 
        onSelectList={handleSelectList}
        onCreateList={handleCreateList}
      />

      {/* list row editor popup */}
      <ListEditorView
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
        onDeleteList={handleDeleteList}
      />

      {/* list item editor view */}
      <ListItemEditorView
        isOpen={isListItemEditorViewOpen}
        onToggleView={handleToggleListItemEditorView}
      />
    </div>
  );
}


const ListView = ({ isOpen, listRowsData, selectedListData, onToggleView, onSelectList, onCreateList }) => (
  <div className='relative grid grid-rows-[auto,1fr,auto] w-80 h-full max-h-screen overflow-scroll'>
    <main>
      <ul className='grid py-1'>
        {listRowsData.map((list) => (
          <ListViewRow
            key={list.id}
            data={list}
            selectedListData={selectedListData}
            onSelectList={onSelectList}
          />
        ))}
      </ul>
    </main>

    <header className='-order-1 sticky top-0 border-b-2 py-3 px-5 bg-slate-100'>Local Data</header>

    <footer className='sticky bottom-0 border-t-2 py-[2px] bg-slate-100'>
      <button 
        onClick={onCreateList}
        className='group w-full px-1 py-[2px]'
      >
        <div className='flex items-center rounded w-full group-hover:bg-slate-500/10'>
          <div className='flex-none grid place-items-center w-10 h-10'>
            <span className='font-mono font-bold text-xl leading-none'>+</span>
          </div>
          <p className='flex-1 text-left'>New list</p>
        </div>
      </button>
    </footer>
  </div>
);

const ListViewRow = ({ data, selectedListData, onSelectList }) => (
  <li>
    <button 
      className='group w-full px-2 py-[2px]'
      onClick={() => onSelectList(data)}
    >
      <div className={
        'relative flex items-center rounded w-full group-hover:bg-slate-500/10 ' + 
        (selectedListData?.id === data.id ? ' bg-slate-500/20 before:left-0 before:inset-y-3 before:w-1 before:absolute before:bg-blue-700 before:rounded-full' : '')}
      >
        <div className='flex-none grid place-items-center w-10 h-10'>
          <span className='font-mono text-lg leading-none'>{data.badge}</span>
        </div>
        <p className='flex-1 text-left truncate w-1'>{data.name}</p>
      </div>
    </button>
  </li>
);

const ListEditorView = ({ isOpen, listData, onUpdateList, onCancelCreate }) => {
  return isOpen && (
    <div
      className='fixed inset-0 z-50 grid place-items-center bg-black/40'
      onClick={onUpdateList}
    >
      <form 
        className=' rounded px-4 py-3 bg-white'
        onClick={(e) => e.stopPropagation()}
        onSubmit={onUpdateList}
      >
        <h2 className='font-medium text-lg'>{!listData.date_updated ? 'New' : 'Rename'} list</h2>
        <div className='flex mt-3 w-full'>
          <input 
            name='badge'
            type="text" 
            className='flex-none w-8 h-8 text-lg text-center leading-none appearance-none outline-none'
            placeholder={defaultListRow.badge}
            maxLength={1}
            defaultValue={listData.badge}
          />
          
          <input 
            name='name'
            type="text"
            className='flex-1 border-b-2 border-b-blue-600 ml-1 appearance-none outline-none'
            placeholder={defaultListRow.name}
            defaultValue={listData.name}
          />
        </div>
        <div className='grid grid-flow-col items-center justify-end gap-1 mt-4 text-sm'>
          <input 
            type="submit" 
            value={!listData.date_updated ? 'Create List' : 'Save'} 
            className='rounded px-2 py-1 font-medium uppercase cursor-pointer hover:bg-black/10'
          />
          <button 
            onClick={onCancelCreate}
            className='-order-1 rounded px-2 py-1 font-medium uppercase hover:bg-black/10'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}


const ListItemView = ({ listItemRowsData, selectedListItemData, selectedListData, onToggleListEditView, onSelectListItem, onDeleteList }) => (
  <div className='grid pt-2'>
    <div className='relative grid grid-rows-[auto,1fr,auto] rounded-tl-2xl px-10 w-full h-full max-h-screen overflow-scroll bg-blue-200'>
      <header className='sticky top-0 flex items-center justify-between pt-10 pb-5 bg-blue-200/90'>
        {/* edit list */}
        <button 
          onClick={onToggleListEditView}
          title='Edit list'
          className='flex items-center rounded hover:bg-slate-500/40'
        >
          {/* list badge */}
          <div className='flex-none grid place-items-center w-10 h-10'>
            <span className='font-mono font-bold text-2xl leading-none'>
              {selectedListData?.badge ?? defaultListRow.badge}
            </span>
          </div>
          {/* list name */}
          <h2 className='flex-1 pl-1 pr-2 font-medium text-2xl text-left truncate'>
            {selectedListData?.name ?? defaultListRow.name}
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

      <ListItemViewLists
        listItemRowsData={listItemRowsData}
        selectedListItemData={selectedListItemData}
        selectedListData={selectedListData}
        onSelectListItem={onSelectListItem}
      />
      
      <ListItemViewForm
        selectedListData={selectedListData}
      />
    </div>
  </div>
);

const ListItemViewLists = ({ listItemRowsData, selectedListItemData, selectedListData, onSelectListItem }) => {
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
      <ul className='grid gap-[2px]'>
        {uncheckedItems && uncheckedItems.map((listItem) => (
          <ListItemViewRow
            key={listItem.id}
            data={listItem}
            selectedListItemData={selectedListItemData}
            onSelectListItem={onSelectListItem}
          />
        ))}
      </ul>

      {checkedItems?.length !== 0 && (<>
        {/* checked list item toggle */}
        <button className='flex items-center rounded my-2 px-2 py-1 bg-white/50 hover:bg-white/80'>
          <span>&gt;</span>
          <p className='ml-2 text-sm'>Completed</p>
        </button>
        {/* list item - checked */}
        <ul className='grid gap-[2px]'>
          {checkedItems && checkedItems.map((listItem) => (
            <ListItemViewRow
              key={listItem.id}
              data={listItem}
              selectedListItemData={selectedListItemData}
              onSelectListItem={onSelectListItem}
            />
          ))}
        </ul>
      </>)}
    </main>
  )
}

const ListItemViewRow = ({ data, selectedListItemData, onSelectListItem }) => (
  <li className={
    'flex rounded-md cursor-pointer hover:bg-white/90 ' + 
    (data.id === selectedListItemData?.id ? 'bg-white' : 'bg-white/70')
  }>
    {/* <p className='mt-2 mb-3 font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(data).replaceAll(',"', ', "')}</p> */}
    {/* toggle is_checked */}
    <button
      title={data.is_checked ? 'Mark as incomplete' : 'Mark as complete'}
      className="group shrink-0 px-1 py-2"
    >
      {/* border */}
      <div className='group grid place-items-center m-2 w-[18px] h-[18px] border-2 border-slate-700 rounded-full'>
        {/* check mark */}
        <div className={
          'w-2 h-2 bg-slate-700/80 rounded-full transition-all group-hover:opacity-100 ' +
          (data.is_checked ? 'opacity-100 group-active:scale-50' : 'opacity-0 group-active:scale-150')
        } />
      </div>
    </button>

    {/* select list item */}
    <button
      title='Select list item'
      onClick={() => onSelectListItem(data)}
      className='flex-1 text-sm text-left'
    >
      <p className={data.is_checked ? 'opacity-60 line-through' : ''}>{data?.title}</p>
    </button>
  </li>
);

const ListItemViewForm = ({ selectedListData }) => {
  const [input, setInput] = React.useState("");
  const [isChecked, setIsChecked] = React.useState(false);

  return (
    <footer className='sticky bottom-0 pt-2 pb-10 w-full bg-blue-200/90'>
      <form className='relative overflow-hidden'>
        {/* list item - title */}
        <input 
          name='title'
          type='text' 
          minLength={1}
          placeholder='Add a task'
          title={`Add a task in "${selectedListData.name}"`}
          className='peer rounded-md py-4 px-11 w-full bg-white/50 text-sm leading-none appearance-none outline-none placeholder:text-black/90 hover:bg-white/80 active:bg-white focus:bg-white'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div 
          className={'absolute inset-0 grid place-items-center w-11 select-none peer-focus:hidden pointer-events-none ' + (input.length > 0 ? '!hidden' : '')}
        >
          <span className='pb-1 font mono text-2xl leading-none'>+</span>
        </div>

        {/* list item - init check state */}
        <button 
          type='button'
          title={isChecked ? 'Mark as incomplete' : 'Mark as complete'}
          className={'absolute inset-0 right-auto px-1 hidden peer-focus:block ' + (input.length > 0 ? '!block' : '')}
          onClick={() => setIsChecked(!isChecked)}
        >
          {/* border */}
          <div className='group grid place-items-center m-2 w-[18px] h-[18px] border-2 border-slate-700 rounded-full'>
            {/* check mark */}
            <div className={
              'w-2 h-2 bg-slate-700/80 rounded-full transition-all group-hover:opacity-100 ' +
              (isChecked ? 'opacity-100 group-active:scale-50' : 'opacity-0 group-active:scale-150')
            } />
          </div>
        </button>

        {/* submit */}
        <button
          type='submit'
          title={input.length > 0 ? 'Add new list item' : 'Invalid input'}
          className={'absolute inset-0 px-2 left-auto cursor-pointer hidden peer-focus:block ' + (input.length > 0 ? '!block' : '!cursor-not-allowed')}
          disabled={input.length < 1}
        >
          {/* <span>↑</span> */}
          <span className={'text-xl leading-none ' + (input.length > 0 ? 'opacity-90' : 'opacity-30')}>⬆️</span> 
        </button>

        <input 
          name='is_checked'
          type='checkbox'  
          className='hidden'
          aria-hidden='true'
          value={isChecked}
        />
      </form>
    </footer>
  )
}




const ListItemEditorView = ({ isOpen, onToggleView }) => {
  
  return (
    <div>

    </div>
  )
}

export default App;
