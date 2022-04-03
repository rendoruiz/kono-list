const ListPanelRow = ({ 
  list, 
  selectedList, 
  onSelectList 
}) => (
  <li>
    <button 
      className='group w-full px-2 py-[2px]'
      onClick={() => onSelectList(list)}
    >
      <div className={
        'relative flex items-center rounded w-full group-hover:bg-slate-500/10 group-active:bg-slate-500/20 ' + 
        (selectedList?.id === list.id ? ' bg-slate-500/10 before:left-0 before:inset-y-3 before:w-1 before:absolute before:bg-blue-600 before:rounded-full' : '')}
      >
        {/* list icon */}
        <div className='flex-none grid place-items-center w-10 h-10'>
          <span className='font-mono text-lg leading-none'>
            {list.icon}
          </span>
        </div>
        
        {/* list name */}
        <p className='flex-1 text-left truncate w-1'>
          {list.name}
        </p>
      </div>
    </button>
  </li>
);
 
export default ListPanelRow;