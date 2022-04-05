import { listTemplate } from "../../data/list";
import TaskCreatorPanel from "./TaskCreatorPanel";
import TaskPanelList from "./TaskPanelList";
import ArrowLeftIcon from "../Icons/ArrowLeftIcon";
import PencilIcon from "../Icons/PencilIcon";
import TrashIcon from "../Icons/TrashIcon";

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
  <div className='relative grid grid-rows-[auto,1fr,auto] h-screen bg-blue-700/70 text-white md:rounded-tl-xl md:px-10'>
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
    <header className='-order-1 sticky top-0 grid grid-cols-[auto,1fr,auto] items-center pt-5 pb-3 px-2 md:grid-cols-[1fr,auto] md:px-0 md:pt-10 md:pb-5'>
      {/* mobile - list panel toggle */}
      <button
        type='button'
        title={`Open lists pane`}
        className='group grid p-[2px] leading-none md:hidden'
        onClick={onToggleListPanel}
      >
        <div className='grid place-items-center rounded w-12 h-12 text-2xl group-hover:bg-white/30 group-active:bg-white/50'>
          <ArrowLeftIcon className='w-8 h-8 stroke-current' />
        </div>
      </button>

      {/* list icon and name + edit list */}
      <button 
        type='button'
        title='Click to rename'
        className='justify-self-start grid grid-cols-[auto,1fr] items-center rounded leading-none hover:bg-black/10 active:bg-black/20'
        onClick={onToggleListEditorPanel}
      >
        {/* list icon */}
        <div className='grid place-items-center w-10 h-10'>
          <div className='font-mono font-bold text-2xl'>
            {selectedList?.icon ?? listTemplate.icon}
          </div>
        </div>
        
        {/* list name */}
        <h2 className='pl-1 pr-2 font-medium text-2xl text-left truncate'>
          {selectedList?.name ?? listTemplate.name}
        </h2>
      </button>
      
      {/* list actions */}
      <div className='grid grid-flow-col gap-2'>
        {/* edit list */}
        <button
          type='button'
          title='Edit list'
          className='grid place-items-center rounded w-10 h-10 leading-none hover:bg-white/30 active:bg-white/50 md:w-8 md:h-8 md:bg-white/80 md:text-black/80 md:hover:bg-white/90 md:active:bg-white'
          onClick={onToggleListEditorPanel}
        >
          <PencilIcon className='w-8 h-8 stroke-current md:w-6 md:h-6' />
        </button>

        {/* delete list */}
        <button
          type='button'
          title='Delete list'
          className='grid place-items-center rounded w-10 h-10 leading-none hover:bg-white/30 active:bg-white/50 md:w-8 md:h-8 md:bg-white/80 md:text-black/80 md:hover:bg-white/90 md:active:bg-white'
          onClick={onDeleteList}
        >
          <TrashIcon className='w-8 h-8 stroke-current md:w-6 md:h-6' />
        </button>
      </div>
    </header>
  </div>
);
 
export default TaskPanel;