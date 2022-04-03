const TaskPanelListRow = ({ data, selectedTask, onSelectListItem, onUpdateListItemCheckState }) => (
  <li className={
    'flex rounded-md cursor-pointer hover:bg-white/90 ' + 
    (data.id === selectedTask?.id ? 'bg-white' : 'bg-white/70')
  }>
    {/* <p className='mt-2 mb-3 font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(data).replaceAll(',"', ', "')}</p> */}

    {/* toggle is_complete */}
    <button
      type='button'
      title={data.is_complete ? 'Mark as incomplete' : 'Mark as complete'}
      onClick={() => onUpdateListItemCheckState(data)}
      className="group shrink-0 px-3 py-4 self-start"
    >
      {/* border */}
      <div className='group grid place-items-center w-[18px] h-[18px] border-2 border-slate-700 rounded-full'>
        {/* check mark */}
        <div className={
          'w-2 h-2 bg-slate-700/80 rounded-full transition-all group-hover:opacity-100 ' +
          (data.is_complete ? 'opacity-100 group-active:scale-50' : 'opacity-0 group-active:scale-150')
        } />
      </div>
    </button>

    {/* select list item */}
    <button
      type='button'
      title='Select list item'
      onClick={() => onSelectListItem(data)}
      className='flex-1 py-3 pr-2 text-sm text-left'
    >
      <p className={data.is_complete ? 'opacity-60 line-through' : ''}>{data?.title}</p>
    </button>
  </li>
);
 
export default TaskPanelListRow;