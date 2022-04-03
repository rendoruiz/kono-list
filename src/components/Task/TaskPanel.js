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
  onToggleListEditorPanel, 
  onToggleListHideCompletedState 
}) => (
  <div className='grid pt-2 max-h-screen'>
    <div className='relative grid grid-rows-[auto,1fr,auto] rounded-tl-xl px-10 overflow-scroll bg-blue-200'>
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
      <header className='-order-1 sticky top-0 flex items-center justify-between pt-10 pb-5 bg-blue-200/90'>
        {/* edit list */}
        <button 
          type='button'
          onClick={onToggleListEditorPanel}
          title='Edit list'
          className='grid grid-cols-[auto,1fr] items-center rounded hover:bg-slate-500/40'
        >
          {/* list badge */}
          <div className='grid place-items-center w-10 h-10'>
            <span className='font-mono font-bold text-2xl leading-none'>
              {selectedList?.badge ?? listTemplate.badge}
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
            onClick={onToggleListEditorPanel}
            title='Edit list'
            className='grid place-items-center rounded w-8 h-8 bg-white/50 leading-none hover:bg-white/80'
          >
            <span>✏️</span>
          </button>

          {/* delete list */}
          <button
            type='button'
            onClick={onDeleteList}
            title='Delete list'
            className='grid place-items-center rounded w-8 h-8 bg-white/50 leading-none hover:bg-white/80'
          >
            <span>🗑️</span>
          </button>
        </div>
      </header>
    </div>
  </div>
);
 
export default TaskPanel;