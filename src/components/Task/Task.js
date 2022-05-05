import { v4 as uuidv4 } from 'uuid';

import { LIST_ACTION } from "../../reducers/listReducer";
import { TASK_ACTION } from "../../reducers/taskReducer";
import TaskEditorPanel from "./TaskEditorPanel/TaskEditorPanel";
import TaskPanel from "./TaskPanel/TaskPanel";

const Task = ({
  task,
  dispatchTask,
  selectedList,
  dispatchList,
  onToggleListPanel
}) => {
  // Delete selected list
  // Delete all tasks associated with selected list
  // Assign the previous list as the selected list
  const handleDeleteList = () => {
    if (selectedList.locked) {
      alert('Cannot delete locked list.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete this list: "${selectedList.name}"?`)) {
      dispatchList({
        type: LIST_ACTION.DELETE_ITEM,
        payload: { listId: selectedList.id },
      });
      dispatchTask({
        type: TASK_ACTION.DELETE_LIST_TASKS,
        payload: { listId: selectedList.list_id },
      });
    }
  }


  // Toggle visibility of completed items within a list
  const handleToggleCompletedItemsVisibility = () => {
    dispatchList({
      type: LIST_ACTION.TOGGLE_COMPLETED_ITEMS_VISIBILITY,
      payload: { listId: selectedList.id },
    });
  }
  
  // Toggle list editor panel (popup) visbility
  const handleToggleListEditorPanel = () => dispatchList({ type: LIST_ACTION.TOGGLE_EDITOR_PANEL });
  


  // Create new task
  // Reset task creator form fields
  // Close task editor
  const handleCreateTask = (taskItem) => {
    dispatchTask({
      type: TASK_ACTION.CREATE_ITEM,
      payload: {
        taskId: uuidv4(),
        listId: selectedList.id,
        title: taskItem.title,
      },
    });
  }

  // Update task item
  const handleUpdateTask = (taskItem) => {
    dispatchTask({
      type: TASK_ACTION.UPDATE_ITEM,
      payload: {
        taskId: task.selectedItem.id,
        title: taskItem.title,
        notes: taskItem.notes,
      },
    });
  }

  // Delete selected task
  const handleDeleteTask = () => {
    dispatchTask({
      type: TASK_ACTION.DELETE_ITEM,
      payload: { taskId: task.selectedItem.id },
    });
  }

  // Set selected task
  // (if same as selected task) Close task editor panel
  // (else) Open task editor panel
  const handleSetSelectedTask = (taskId) => {
    dispatchTask({
      type: TASK_ACTION.SELECT_ITEM,
      payload: { taskId: taskId },
    });
  }

  // Toggle task item completed value
  const handleToggleTaskCompleteState = (taskId) => {
    dispatchTask({
      type: TASK_ACTION.TOGGLE_ITEM_COMPLETED,
      payload: { taskId: taskId }
    });
  }

  // Close task editor panel
  const handleCloseTaskEditorPanel = () => dispatchTask({ type: TASK_ACTION.CLOSE_EDITOR_PANEL });

  // Update task item indices (sorting)
  const handleUpdateTaskOrder = (currentTaskId, targetTaskId) => {
    dispatchTask({
      type: TASK_ACTION.UPDATE_INDICES,
      payload: {
        currentTaskId: currentTaskId,
        targetTaskId: targetTaskId,
      },
    })
  }

  return (  
    <>
      <TaskPanel
        taskItems={task.taskItems}
        selectedList={selectedList}
        selectedTask={task.selectedItem}
        onDeleteList={handleDeleteList}
        onCreateTask={handleCreateTask}
        onSelectTask={handleSetSelectedTask}
        onToggleTaskCompleteState={handleToggleTaskCompleteState}
        onToggleCompletedItemsVisibility={handleToggleCompletedItemsVisibility}
        onToggleListPanel={onToggleListPanel}
        onToggleListEditorPanel={handleToggleListEditorPanel}
        onReorderTaskItems={handleUpdateTaskOrder}
      />
      <TaskEditorPanel
        isOpen={task.isEditorPanelOpen}
        selectedTask={task.selectedItem}
        selectedList={selectedList}
        onTogglePanel={handleCloseTaskEditorPanel}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onToggleTaskCompleteState={handleToggleTaskCompleteState}
      />
    </>
  );
}
 
export default Task;