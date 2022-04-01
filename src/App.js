import * as React from 'react';

const useLocalState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}


const App = () => {
  const [isListViewOpen, setIsListViewOpen] = useLocalState('isListViewOpen', true);
  const [isListItemEditorViewOpen, setIsListItemEditorViewOpen] = useLocalState('isListItemEditorViewOpen', false);

  const handleToggleListView = () => setIsListViewOpen(!isListViewOpen);

  const handleToggleListItemEditorView = () => setIsListItemEditorViewOpen(!isListItemEditorViewOpen);

  return (
    <div>
      {/* list view */}
      <ListView 
        isOpen={isListViewOpen} 
        onToggleView={handleToggleListView} 
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

const ListView = ({ isOpen, onToggleView }) => {
  
  return (
    <div>
      <header></header>

      <main>

      </main>

      <footer></footer>
    </div>
  )
}

const List = () => (
  <div>

  </div>
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
