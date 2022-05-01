/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import { taskTemplate } from "../data/task";

const TASK_ACTION = {
  CREATE_ITEM: 'create_item',
  UPDATE_ITEM: 'update_item',
  DELETE_ITEM: 'delete_item',
  SELECT_ITEM: 'select_item',
  DELETE_LIST_TASKS: 'delete_delete_tasks',
  TOGGLE_ITEM_COMPLETED: 'toggle_item_completed',
  CLOSE_EDITOR_PANEL: 'close_editor_panel',
}

const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTION.CREATE_ITEM:
      const newItem = {
        ...taskTemplate,
        id: action.payload.taskId,
        list_id: action.payload.listId,
        title: action.payload.title,
      }
      return {
        ...state,
        taskItems: [...state.taskItems, newItem],
        isEditorPanelOpen: false,
      }

    
    case TASK_ACTION.UPDATE_ITEM:    
      const newTitle = action.payload.title.trim();
      return {
        ...state,
        taskItems: state.taskItems.map((item) => {
          if (item.id === action.payload.taskId) {
            return {
              ...item,
              name: newTitle.length > 0 ? newTitle : item.name,
              notes: action.payload.notes.trim(),
              date_updated: Date.now(),
            }
          }
          return item;
        }),
      }

    case TASK_ACTION.DELETE_ITEM:
      return {
        ...state,
        taskItems: state.taskItems.filter(
          (item) => item.id !== action.payload.taskId
        ),
        selectedItem: null,
        isEditorPanelOpen: false,
      }

    case TASK_ACTION.DELETE_LIST_TASKS:
      return {
        ...state,
        taskItems: state.taskItems.filter(
          (item) => item.list_id !== action.payload.listId
        ),
        selectedItem: null,
        isEditorPanelOpen: false,
      }


    case TASK_ACTION.TOGGLE_ITEM_COMPLETED:
      return {
        ...state,
        taskItems: state.taskItems.map((item) => {
          if (item.id === action.payload.taskId) {
            return {
              ...item,
              is_complete: !item.is_complete,
            }
          }
          return item;
        }),
      }

    case TASK_ACTION.SELECT_ITEM:
      const newSelecteItem = action.payload.taskId === state.selectedItem.id
       ? null
       : state.taskItems.filter((item) => item.id === action.payload.taskId).pop() ?? null;
      return {
        ...state,
        selectedItem: newSelecteItem,
        isEditorPanelOpen: newSelecteItem ? true : false,
      }

    case TASK_ACTION.CLOSE_EDITOR_PANEL:
      return {
        ...state,
        isEditorPanelOpen: false,
      }

    default:
      throw new Error();
  }
}
 
export { taskReducer, TASK_ACTION };