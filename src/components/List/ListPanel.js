import ListPanelRow from "./ListPanelRow";

const ListPanel = ({ 
  isOpen, 
  listItems, 
  selectedList, 
  onTogglePanel, 
  onSelectList, 
  onCreateList 
}) => (
  <>
    {/* mobile backdrop toggle */}
    <div 
      className={
        'absolute inset-0 z-30 transition-opacity duration-300 bg-black/70 md:hidden ' +
        (isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full')
      }
      onClick={onTogglePanel}
    />

    {/* panel */}
    <div className={
      'absolute inset-0 right-auto z-30 grid grid-rows-[1fr,auto] w-full h-screen bg-slate-100 transition-transform duration-200 bp520:w-72 md:relative md:translate-x-0 md:transition-none  ' +
      (isOpen ? 'md:translate-x-0' : '-translate-x-full')
    }>
      <main className='overflow-y-auto'>
        {/* list items */}
        <ul className='grid py-1'>
          {listItems.map((list) => (
            <ListPanelRow
              key={list.id}
              list={list}
              selectedList={selectedList}
              onSelectList={onSelectList}
            />
          ))}
        </ul>
      </main>

      {/* <header className='-order-1 sticky top-0 border-b-2 py-3 px-5 '></header> */}

      <footer className='sticky bottom-0 border-t-2 py-[2px]'>
        {/* add new list button */}
        <button 
          title='New list: Add a list'
          onClick={onCreateList}
          className='group w-full px-1 py-[2px]'
        >
          <div className='flex items-center rounded w-full group-hover:bg-slate-500/10 group-active:bg-slate-500/30'>
            <div className='flex-none grid place-items-center w-10 h-10'>
              <span className='pb-[2px] font-mono text-2xl leading-none'>+</span>
            </div>
            <p className='flex-1 text-left'>New list</p>
          </div>
        </button>
      </footer>
    </div>
  </>
);
 
export default ListPanel;