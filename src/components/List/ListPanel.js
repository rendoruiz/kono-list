import ListPanelItem from "./ListPanelItem";

const ListPanel = ({ 
  isOpen, 
  listItems, 
  selectedList, 
  onToggleView, 
  onSelectList, 
  onCreateList 
}) => (
  <div className='relative grid grid-rows-[auto,1fr,auto] w-80 h-full max-h-screen overflow-scroll'>
    <main>
      <ul className='grid py-1'>
        {listItems.map((list) => (
          <ListPanelItem
            key={list.id}
            list={list}
            selectedList={selectedList}
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
            <span className='pb-[2px] font-mono text-2xl leading-none'>+</span>
          </div>
          <p className='flex-1 text-left'>New list</p>
        </div>
      </button>
    </footer>
  </div>
);
 
export default ListPanel;