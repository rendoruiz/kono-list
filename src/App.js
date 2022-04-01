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

  console.log("reduce!")
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
  const [isListViewOpen, setIsListViewOpen] = React.useState('isListViewOpen', true);
  const [isListItemEditorViewOpen, setIsListItemEditorViewOpen] = useLocalState('isListItemEditorViewOpen', false);
  const [listArray, dispatchListArray] = React.useReducer(
    listArrayReducer,
    { 
      data: JSON.parse(localStorage.getItem('lists')) ?? defaultListArray, 
      localKey: 'lists',
    }
  );
  const [selectedList, setSelectedList] = useLocalState('selected_list', null);

  const handleToggleListView = () => setIsListViewOpen(!isListViewOpen);

  const handleToggleListItemEditorView = () => setIsListItemEditorViewOpen(!isListItemEditorViewOpen);

  const handleCreateList = () => {
    const newId = uuidv4();
    dispatchListArray({
      type: 'LIST_CREATE',
      payload: { id: newId }
    });
    setSelectedList(newId);
  }

  const handleOpenList = (id) => {
    setSelectedList(id);
  }

  const handleUpdateList = (event, list) => {

  }

  

  return (
    <div className='h-screen w-screen bg-blue-300'>
      {/* list view */}
      <ListView 
        isOpen={isListViewOpen} 
        onToggleView={handleToggleListView} 
        data={listArray.data}
        onCreateList={handleCreateList}
        onOpenList={handleOpenList}
        selectedList={selectedList}
      />

      {/* list item view */}
      <div>
      </div>

      {/* list item editor view */}
      <ListItemEditorView
        isOpen={isListItemEditorViewOpen}
        onToggleView={handleToggleListItemEditorView}
      />
    </div>
  );
}


const ListView = ({ isOpen, onToggleView, data, onCreateList, onOpenList, selectedList }) => {
  return (
    <div className='grid grid-rows-[auto,1fr,auto] w-80 h-full'>
      <header className='p-5 bg-blue-600'></header>

      <main className='overflow-scroll'>
        <ul className='grid'>
          {data.map((list) => (
            <List
              key={list.id}
              data={list}
              onOpenList={onOpenList}
              selectedList={selectedList}
            />
          ))}
        </ul>
          
      </main>

      <footer className='sticky bottom-0 p-5 bg-blue-600'>
        <button onClick={onCreateList}>New List</button>
      </footer>
    </div>
  )
}

const List = ({ data, onOpenList, selectedList }) => {
  
  return (
    <li>
      <button 
        className='group w-full px-1 py-[2px]'
        onClick={() => onOpenList(data.id)}
      >
        <div className={'relative flex items-center rounded w-full group-hover:bg-slate-500/40 ' + (selectedList===data.id && " bg-slate-500/30 before:left-0 before:inset-y-3 before:w-1 before:absolute before:bg-blue-700 before:rounded-full")}>
          <div className='flex-none grid place-items-center w-10 h-10'>
            <span className='font-mono text-lg leading-none'>{data.badge}</span>
          </div>
          <p className='flex-1 text-left truncate w-1'>{data.name}</p>
        </div>
      </button>
    </li>
  )
}



const ListItemView = () => (
  <div>

  </div>
)

const ListItem = () => {
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
