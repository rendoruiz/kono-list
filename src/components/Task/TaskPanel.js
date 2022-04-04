import { listTemplate } from "../../data/list";
import TaskCreatorPanel from "./TaskCreatorPanel";
import TaskPanelList from "./TaskPanelList";

const TaskPanel = ({ 
  taskItems, 
  selectedTask, 
  selectedList, 
  onSelectTask, 
  onCreateTask, 
  onToggleTaskCompleteState, 
  onDeleteList, 
  onToggleListPanel,
  onToggleListEditorPanel, 
  onToggleListHideCompletedState 
}) => (
  <div className='relative grid grid-rows-[auto,1fr,auto] h-screen bg-blue-200 md:rounded-tl-xl md:px-10'>
    <TaskPanelList
      taskItems={taskItems}
      selectedTask={selectedTask}
      selectedList={selectedList}
      onSelectTask={onSelectTask}
      onToggleTaskCompleteState={onToggleTaskCompleteState}
      onToggleListHideCompletedState={onToggleListHideCompletedState}
    />
    
    <TaskCreatorPanel
      selectedList={selectedList}
      onCreateTask={onCreateTask}
    />

    {/* selected list */}
    <header className='-order-1 sticky top-0 grid grid-cols-[auto,1fr,auto] items-center px-2 pt-2 pb-3 bg-blue-200/90 md:grid-cols-[1fr,auto] md:px-0 md:pt-10 md:pb-5'>
      {/* mobile - list panel toggle */}
      <button
        className='grid place-items-center rounded mr-2 w-9 h-9 text-2xl leading-none hover:bg-white/50 active:bg-white/70 md:hidden'
        onClick={onToggleListPanel}
      >
        <span>⬅️</span>
      </button>

      {/* edit list */}
      <button 
        type='button'
        title='Click to rename'
        className='justify-self-start grid grid-cols-[auto,1fr] items-center rounded hover:bg-white/50 active:bg-white/70'
        onClick={onToggleListEditorPanel}
      >
        {/* list icon */}
        <div className='grid place-items-center w-10 h-10'>
          <span className='font-mono font-bold text-2xl leading-none'>
            {selectedList?.icon ?? listTemplate.icon}
          </span>
        </div>
        
        {/* list name */}
        <h2 className='pl-1 pr-2 font-medium text-2xl text-left truncate'>
          {selectedList?.name ?? listTemplate.name}
        </h2>
      </button>
      
      {/* list actions */}
      <div className='shrink-0 grid grid-flow-col gap-2'>
        {/* edit list */}
        <button
          type='button'
          title='Edit list'
          className='grid place-items-center rounded w-8 h-8 bg-white/50 leading-none hover:bg-white/80 active:bg-white'
          onClick={onToggleListEditorPanel}
        >
          <span>✏️</span>
        </button>

        {/* delete list */}
        <button
          type='button'
          title='Delete list'
          className='grid place-items-center rounded w-8 h-8 bg-white/50 leading-none hover:bg-white/80 active:bg-white'
          onClick={onDeleteList}
        >
          <span>🗑️</span>
        </button>
      </div>
    </header>
  </div>
);
 
export default TaskPanel;