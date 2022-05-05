import { v4 as uuidv4 } from 'uuid';

import { LIST_ACTION } from "../../reducers/listReducer";
import { TASK_ACTION } from '../../reducers/taskReducer';
import ListEditorPanel from "./ListEditorPanel/ListEditorPanel";
import ListPanel from "./ListPanel/ListPanel";

const List = ({
  list,
  dispatchList,
  dispatchTask,
  onToggleListPanel,
  onToggleAppSettings,
}) => {
  // Create new list item
  // Use the new list item as selected list
  // Close list editor panel
  const handleCreateList = () => {
    dispatchList({
      type: LIST_ACTION.CREATE_ITEM,
      payload: { listId: uuidv4() },
    });
  }

  // (if new list) Delete recently created list item
  // (if new list) Assign the previous list as the selected list
  // Close list editor panel 
  const handleCloseListEditor = () => {
    if (!list.selectedItem.date_updated) {
      dispatchList({
        type: LIST_ACTION.DELETE_ITEM,
        payload: { listId: list.selectedItem.id },
      });
    } else {
      dispatchList({ type: LIST_ACTION.TOGGLE_EDITOR_PANEL });
    }
  }

  // Update list item
  // Set new selected list
  // Close list editor panel
  // (if new list) Close task editor
  const handleUpdateList = (listItem) => {
    if (list.selectedItem.locked) {
      alert('Cannot update locked list.');
      dispatchList({ type: LIST_ACTION.TOGGLE_EDITOR_PANEL });
      return;
    }

    dispatchList({
      type: LIST_ACTION.UPDATE_ITEM,
      payload: {
        listId: listItem.id,
        name: listItem.name,
        icon: listItem.icon,
      }
    });

    if (!list.selectedItem.date_updated) {
      dispatchTask({ type: TASK_ACTION.CLOSE_EDITOR_PANEL });
    }
  }

  // Set selected list
  // Close list panel (mobile)
  // Close task editor
  const handleSetSelectedList = (listId) => {
    dispatchList({
      type: LIST_ACTION.SELECT_ITEM,
      payload: { listId: listId },
    });
    dispatchTask({ type: TASK_ACTION.CLOSE_EDITOR_PANEL });
  }

  // Update list item indices (sorting)
  const handleReorderListItems = (currentListId, targetListId) => {
    dispatchList({
      type: LIST_ACTION.UPDATE_USER_INDICES,
      payload: {
        currentListId: currentListId,
        targetListId: targetListId,
      },
    })
  }

  return (  
    <>
      <ListPanel
        isOpen={list.isPanelOpen} 
        appListItems={list.appListItems}
        userListItems={list.userListItems}
        selectedList={list.selectedItem}
        onCreateList={handleCreateList}
        onSelectList={handleSetSelectedList}
        onTogglePanel={onToggleListPanel} 
        onToggleSettingsPanel={onToggleAppSettings}
        onReorderListItems={handleReorderListItems}
      />
      <ListEditorPanel
        isOpen={list.isEditorPanelOpen}
        selectedList={list.selectedItem}
        onUpdateList={handleUpdateList}
        onCancelEdit={handleCloseListEditor}
      />
    </>
  );
}
 
export default List;