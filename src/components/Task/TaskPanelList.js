import * as React from 'react';

import TaskPanelListRow from './TaskPanelListRow';

const TaskPanelList = ({ 
  listItemRowsData, 
  selectedListItemData, 
  selectedListData, 
  onSelectListItem, 
  onUpdateListItemCheckState, 
  onUpdateListCheckedItemState 
}) => {
  const [checkedItems, setCheckedItems] = React.useState(null);
  const [uncheckedItems, setUncheckedItems] = React.useState(null);

  React.useEffect(() => {
    setCheckedItems(listItemRowsData.filter((listItem) => listItem.is_checked && listItem.list_id === selectedListData.id));
    setUncheckedItems(listItemRowsData.filter((listItem) => !listItem.is_checked && listItem.list_id === selectedListData.id));
  }, [listItemRowsData, selectedListData]);

  return (
    <main className=''>
      {/* debug list */}
      {/* <p className='mt-2 mb-3 font-mono font-medium text-xs uppercase break-word'>{JSON.stringify(selectedListData).replaceAll(',"', ', "')}</p> */}

      {/* list item - unchecked */}
      <ul className='grid gap-[3px]'>
        {uncheckedItems && uncheckedItems.map((listItem) => (
          <TaskPanelListRow
            key={listItem.id}
            data={listItem}
            selectedListItemData={selectedListItemData}
            onSelectListItem={onSelectListItem}
            onUpdateListItemCheckState={onUpdateListItemCheckState}
          />
        ))}
      </ul>

      {checkedItems?.length !== 0 && (
        <>
          {/* checked list item toggle */}
          <button 
            type='button'
            className='flex items-center rounded my-2 px-2 py-1 bg-white/50 text-sm hover:bg-white/80'
            onClick={onUpdateListCheckedItemState}
          >
            {/* caret */}
            <span className={
              'px-1 scale-y-125 origin-center ' + 
              (!selectedListData.is_checked_hidden ? 'rotate-90' : '')}
            >
              &gt;
            </span>
            <p className='ml-1 mr-2'>Completed</p>
            {/* completed task count */}
            <span>{checkedItems?.length}</span>
          </button>

          {/* list item - checked */}
          {!selectedListData.is_checked_hidden && (
            <ul className='grid gap-[3px]'>
              {checkedItems && checkedItems.map((listItem) => (
                <TaskPanelListRow
                  key={listItem.id}
                  data={listItem}
                  selectedListItemData={selectedListItemData}
                  onSelectListItem={onSelectListItem}
                  onUpdateListItemCheckState={onUpdateListItemCheckState}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  )
}
 
export default TaskPanelList;