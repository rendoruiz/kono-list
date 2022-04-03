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
        'relative flex items-center rounded w-full group-hover:bg-slate-500/10 ' + 
        (selectedList?.id === list.id ? ' bg-slate-500/20 before:left-0 before:inset-y-3 before:w-1 before:absolute before:bg-blue-600 before:rounded-full' : '')}
      >
        <div className='flex-none grid place-items-center w-10 h-10'>
          <span className='font-mono text-lg leading-none'>{list.badge}</span>
        </div>
        <p className='flex-1 text-left truncate w-1'>{list.name}</p>
      </div>
    </button>
  </li>
);
 
export default ListPanelRow;