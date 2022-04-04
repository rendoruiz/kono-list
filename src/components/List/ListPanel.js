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
        'fixed inset-0 z-30 transition-opacity duration-300 bg-black/70 md:hidden ' +
        (isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full')
      }
      onClick={onTogglePanel}
    />

    {/* panel container */}
    <div className={
      'fixed inset-0 right-auto z-30 grid grid-rows-[1fr,60px] w-full h-screen bg-slate-100 transition-transform duration-200 bp520:grid-rows-[1fr,auto] bp520:w-72 md:relative md:z-auto md:translate-x-0 md:transition-none  ' +
      (isOpen ? 'md:translate-x-0' : '-translate-x-full')
    }>
      {/* list rows */}
      <main className='overflow-y-auto pt-3 py-1 bp520:pt-2'>
        <ul className='grid'>
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

      <footer className='fixed inset-0 top-auto grid grid-cols-[1fr,auto] border-t-2 p-[2px] bg-inherit bp520:sticky'>
        {/* add new list button */}
        <button 
          type='button'
          title='New list: add a list'
          onClick={onCreateList}
          className='group grid p-[2px] leading-none'
        >
          <div className='grid grid-cols-[auto,1fr] items-center rounded w-full group-hover:bg-slate-500/10 group-active:bg-slate-500/30'>
            <div className='grid place-items-center w-12 h-12 font-mono text-2xl bp520:w-10 bp520:h-10'>
              +
            </div>
            <span className='text-left'>New list</span>
          </div>
        </button>

        <button
          type='button'
          title='Open settings'
          className='group grid p-[2px] leading-none'
        >
          <div className='grid place-items-center rounded w-12 h-12 text-2xl group-hover:bg-slate-500/10 group-active:bg-slate-500/30 bp520:w-10 bp520:h-10'>
            ⚙️
          </div>
        </button>
      </footer>
    </div>
  </>
);
 
export default ListPanel;