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
        ...action.payload,
        id: uuidv4(),
        date_created: Date.now(),
        date_updated: null,
      };
      const newData = state.data;
      newData.push(newList);
      newState = { 
        ...state,
        data: newData,
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
          (list) => list.id !== action.id
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
  const [isListViewOpen, setIsListViewOpen] = React.useState('isListViewOpen', true);
  const [isListItemEditorViewOpen, setIsListItemEditorViewOpen] = useLocalState('isListItemEditorViewOpen', false);
  const [listArray, dispatchListArray] = React.useReducer(
    listArrayReducer,
    { 
      data: JSON.parse(localStorage.getItem('lists')) ?? defaultListArray, 
      localKey: 'lists',
    }
  );
  console.log(listArray.data)

  const handleToggleListView = () => setIsListViewOpen(!isListViewOpen);

  const handleToggleListItemEditorView = () => setIsListItemEditorViewOpen(!isListItemEditorViewOpen);

  const handleCreateList = () => {
    dispatchListArray({
      type: 'LIST_CREATE',
      payload: {
        name: "test",
        badge: "😚",
      }
    })
  }

  return (
    <div className='h-screen w-screen bg-blue-300'>
      {/* list view */}
      <ListView 
        isOpen={isListViewOpen} 
        onToggleView={handleToggleListView} 
        data={listArray.data}
        onCreateList={handleCreateList}
      />

      {/* list item view */}

      {/* list item editor view */}
      <ListItemEditorView
        isOpen={isListItemEditorViewOpen}
        onToggleView={handleToggleListItemEditorView}
      />
    </div>
  );
}


const ListView = ({ isOpen, onToggleView, data, onCreateList }) => {
  return (
    <div className='relative grid grid-rows-[auto,1fr,auto] h-full w-80'>
      <header className='p-5 bg-blue-600'></header>

      <main className=''>
        <ul>
          {JSON.stringify(data)}
          {data.map((list) => (
            <List
              key={list.id}
              list={list}
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

const List = ({ list }) => (
  <li>
    <button>
      <span className='w-5 h-5 font-mono leading-none'>{list.badge}</span>
      <p>{list.name}</p>
    </button>
  </li>
)



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
