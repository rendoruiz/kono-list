import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

const defaultListArray = [
  {
    id: 0,
    name: "Tasks",
    date_created: Date.now(),
    date_updated: null,
    badge: "⭐",
  },
];

const listArrayReducer = (state, action) => {
  let newState;

  switch(action.type) {
    case 'LIST_CREATE':
      const newList = {
        id: action.payload.id,
        name: 'Untitled list',
        badge: '📃',
        date_created: Date.now(),
        date_updated: null,
      };
      newState = { 
        ...state,
        data: [...state.data, newList],
      };
      break;
    case 'LIST_UPDATE':
      newState = state.data.map((list) => {
        if (list.id === action.payload.id) {
          const updatedItem = {
            ...list,
            name: action.payload.name,
            badge: action.payload.badge ?? list.badge,
            date_updated: Date.now(),
          };
          return updatedItem;
        }
        return list;
      });
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
  const [listRowsData, dispatchListRowsData] = React.useReducer(
    listArrayReducer,
    { 
      data: JSON.parse(localStorage.getItem('lists')) ?? defaultListArray, 
      localKey: 'lists',
    }
  );

  const [isListItemEditorViewOpen, setIsListItemEditorViewOpen] = useLocalState('isListItemEditorViewOpen', false);

  const [selectedList, setSelectedList] = useLocalState('selected_list', { id: 0 });

  const handleToggleListView = () => setIsListViewOpen(!isListViewOpen);
  const handleToggleListEditorView = () => setIsListEditorViewOpen(!isListEditorViewOpen);

  const handleToggleListItemEditorView = () => setIsListItemEditorViewOpen(!isListItemEditorViewOpen);

  

  const handleEditList = () => {
    const newListId = uuidv4();
    dispatchListRowsData({
      type: 'LIST_CREATE',
      payload: { id: newListId }
    });
    setSelectedList({ id: newListId });
    handleToggleListEditorView();
  }

  const handleCancelEditList = () => {
    dispatchListRowsData({
      type: 'LIST_DELETE',
      payload: { id: selectedList.id }
    });
    const selectedListIndex = listRowsData.data.findIndex((list) => list.id === selectedList.id);
    setSelectedList(listRowsData.data[selectedListIndex - 1]);
  }

  const handleSelectList = (listData) => {
    setSelectedList(listData);
  }
  

  return (
    <div className='grid grid-cols-[auto,1fr,auto] h-screen w-screen bg-slate-100 overflow-hidden'>
      {/* list view */}
      <ListView 
        isOpen={isListViewOpen} 
        listRowsData={listRowsData.data}
        selectedListData={selectedList}
        onToggleView={handleToggleListView} 
        onSelectList={handleSelectList}
        onEditList={handleEditList}
      />

      <ListEditorView
        isOpen={isListEditorViewOpen}
        listData={selectedList}
        onToggleView={handleToggleListEditorView}
        onCancelEdit={handleCancelEditList}
      />

      {/* list item view */}
      <ListItemView

      />

      {/* list item editor view */}
      <ListItemEditorView
        isOpen={isListItemEditorViewOpen}
        onToggleView={handleToggleListItemEditorView}
      />
    </div>
  );
}


const ListView = ({ isOpen, listRowsData, selectedListData, onToggleView, onSelectList, onEditList }) => (
  <div className='grid grid-rows-[auto,1fr,auto] w-80 h-full'>
    <header className='p-5'></header>

    <main className='overflow-scroll'>
      <ul className='grid'>
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

    <footer className='sticky bottom-0 py-1'>
      <button 
        onClick={onEditList}
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

const ListEditorView = ({ isOpen, listData, onToggleView, onCancelEdit }) => {
  const handleCancelEdit = (event) => {
    onCancelEdit();
    onToggleView();
    event.preventDefault();
  }

  return isOpen && (
    <div
      className='fixed inset-0 z-50 grid place-items-center bg-black/40'
      onClick={onToggleView}
    >
      <form 
        className=' rounded px-4 py-3 bg-white'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='font-medium text-lg'>{!listData?.date_updated ? 'New' : 'Rename'} list</h2>
        <div className='flex mt-3 w-full'>
          <input 
            type="text" 
            className='flex-none w-8 h-8 text-lg text-center leading-none appearance-none'
            placeholder='📃'
            maxLength={1}
            defaultValue={listData?.badge}
          />
          
          <input 
            type="text"
            className='flex-1 border-b-2 border-b-blue-600 ml-1 appearance-none'
            placeholder='Untitled list'
            defaultValue={listData?.name}
          />
        </div>
        <div className='grid grid-flow-col items-center justify-end gap-1 mt-4 text-sm'>
          <button 
            onClick={handleCancelEdit}
            className='rounded px-2 py-1 font-medium uppercase hover:bg-black/10'
          >
            Cancel
          </button>
          <input 
            type="submit" 
            value={!listData?.date_updated ? 'Create List' : 'Save'} 
            className='rounded px-2 py-1 font-medium uppercase cursor-pointer hover:bg-black/10'
          />
        </div>
      </form>
    </div>
  )
}


const ListItemView = ({ listItemRowsData, selectedList }) => (
  <div className='pt-2'>
    <div className='rounded-tl-2xl w-full h-full bg-blue-200'>
      <header></header>
      <main className='overflow-scroll'>
        <ul className='grid'>

        </ul>
      </main>
      <footer className='sticky bottom-0 py-1'></footer>
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
