import { eventWrapper } from '@testing-library/user-event/dist/utils';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

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
  name: 'Untitled list',
  badge: '📃',
  date_created: Date.now(),
  date_updated: null,
}

const initialListItemRows = [
  {
    id: 0,
    list_id: 0,
    is_checked: false,
    date_created: Date.now(),
    date_updated: null,
    text: 'List Item 1',
  },
  {
    id: 1,
    list_id: 0,
    is_checked: true,
    date_created: Date.now(),
    date_updated: null,
    text: 'List Item 2',
  },
  {
    id: 2,
    list_id: 0,
    is_checked: false,
    date_created: Date.now(),
    date_updated: null,
    text: 'List Item 3',
  },
];

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
            const updatedItem = {
              ...list,
              name: action.payload.name ?? list.name,
              badge: action.payload.badge ?? list.badge,
              date_updated: Date.now(),
            };
            return updatedItem;
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

const useLocalState = (key, initialState) => {
  const [value, setValue] = React.useState(
    JSON.parse(localStorage.getItem(key)) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}


const App = () => {
  const [isListViewOpen, setIsListViewOpen] = React.useState(true);
  const [isListEditorViewOpen, setIsListEditorViewOpen] = React.useState(false);
  const [isListItemEditorViewOpen, setIsListItemEditorViewOpen] = useLocalState('isListItemEditorViewOpen', false);

  const [listRows, dispatchListRows] = React.useReducer(
    listRowsReducer,
    { 
      data: JSON.parse(localStorage.getItem('lists')) ?? initialListRows, 
      localKey: 'lists',
    }
  );
  const [selectedListData, setSelectedListData] = useLocalState('selected_list', { id: 0 });
  
  const handleToggleListView = () => setIsListViewOpen(!isListViewOpen);
  const handleToggleListEditorView = () => setIsListEditorViewOpen(!isListEditorViewOpen);
  const handleToggleListItemEditorView = () => setIsListItemEditorViewOpen(!isListItemEditorViewOpen);

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
    dispatchListRows({
      type: 'LIST_UPDATE',
      payload: {
        ...selectedListData,
        name: event.target?.name?.value,
        badge: event.target?.badge?.value,
      },
    });

    // complete selected list data and close editor
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


  const handleSelectList = (listData) => {
    setSelectedListData(listData);
  }

  const setCompletedSelectedListData = (goBackward = false) => {
    const selectedListIndex = listRows.data.findIndex((list) => list.id == selectedListData.id);
    setSelectedListData(listRows.data[selectedListIndex - (goBackward ? 1 : 0)]);
  }
  

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
        selectedListData={selectedListData}
        onToggleListEditView={handleToggleListEditorView}
        onDeleteList={handleDeleteList}
        // onEditList={handleEditList}
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
        <div className='flex items-center rounded w-full group-hover:bg-slate-500/40'>
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
        (selectedListData?.id===data.id && " bg-slate-500/20 before:left-0 before:inset-y-3 before:w-1 before:absolute before:bg-blue-700 before:rounded-full")}
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
      onSubmit={onUpdateList}
    >
      <form 
        className=' rounded px-4 py-3 bg-white'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='font-medium text-lg'>{!listData?.date_updated ? 'New' : 'Rename'} list</h2>
        <div className='flex mt-3 w-full'>
          <input 
            name='badge'
            type="text" 
            className='flex-none w-8 h-8 text-lg text-center leading-none appearance-none outline-none'
            placeholder={defaultListRow.badge}
            maxLength={1}
            defaultValue={listData?.badge}
          />
          
          <input 
            name='name'
            type="text"
            className='flex-1 border-b-2 border-b-blue-600 ml-1 appearance-none outline-none'
            placeholder={defaultListRow.name}
            defaultValue={listData?.name}
          />
        </div>
        <div className='grid grid-flow-col items-center justify-end gap-1 mt-4 text-sm'>
          <input 
            type="submit" 
            value={!listData?.date_updated ? 'Create List' : 'Save'} 
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


const ListItemView = ({ listItemRowsData, selectedListData, onToggleListEditView, onDeleteList }) => (
  <div className='pt-2'>
    <div className='rounded-tl-2xl p-10 w-full h-full bg-blue-200'>
      <header className='flex justify-between'>
        <button 
          onClick={onToggleListEditView}
          title='Edit list'
          className='flex rounded hover:bg-slate-500/40'
        >
          <div className='flex-none grid place-items-center w-10 h-10'>
            <span className='font-mono font-bold text-2xl leading-none'>{selectedListData.badge ?? defaultListRow.badge}</span>
          </div>
          <h2 className='flex-1 pt-[2px] pl-1 pr-2 h-full font-medium text-2xl text-left'>{selectedListData.name ?? defaultListRow.name}</h2>
        </button>
        
        <button
          onClick={onDeleteList}
          title='Delete list'
          className='grid place-items-center rounded w-10 h-10 bg-white/50 text-lg hover:bg-white/80'
        >
          <span className='leading-none'>🗑️</span>
        </button>
      </header>
      <main className='overflow-scroll'>
        { JSON.stringify(selectedListData)}
        <ul className='grid'>

        </ul>
      </main>
      <footer className='sticky bottom-0 py-1'>

      </footer>
    </div>
  </div>
)

const ListItemViewRow = () => {
  <div>

  </div>
}

const ListItemEditorView = ({ isOpen, onToggleView }) => {
  
  return (
    <div>

    </div>
  )
}

export default App;
