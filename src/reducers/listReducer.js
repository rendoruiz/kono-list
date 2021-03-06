/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import { listTemplate, initialListItems } from "../data/list";
import { getDecryptedList } from "../utils/encryptedStorage";

const storedList = getDecryptedList();
const defaultList = {
  listItems: storedList?.listItems ?? initialListItems, 
  selectedItem: storedList?.selectedItem ?? initialListItems[0],
  isPanelOpen: storedList?.isPanelOpen ?? true,
  isEditorPanelOpen: false,
}

const LIST_ACTION = {
  CREATE_ITEM: 'create_item',
  UPDATE_ITEM: 'update_item',
  DELETE_ITEM: 'delete_item',
  SELECT_ITEM: 'select_item',
  TOGGLE_COMPLETED_ITEMS_VISIBILITY: 'toggle_completed_items_visibility',
  TOGGLE_PANEL: 'toggle_panel',
  TOGGLE_EDITOR_PANEL: 'toggle_editor_panel',
}

const listReducer = (state, action) => {
  switch (action.type) {
    case LIST_ACTION.CREATE_ITEM: {
      const newItem = {
        ...listTemplate,
        id: action.payload.listId,
      }
      return {
        ...state,
        listItems: [...state.listItems, newItem],
        selectedItem: newItem,
        isEditorPanelOpen: true,
      }
    }

    case LIST_ACTION.UPDATE_ITEM: {
      let newSelectedItem = null;
      const newName = action.payload.name.trim();
      return {
        ...state,
        listItems: state.listItems.map((item) => {
          if (item.id === action.payload.listId) {
            newSelectedItem = {
              ...item,
              name: newName.length > 0 ? newName : listTemplate.name,
              icon: action.payload.icon ?? item.icon,
              date_updated: Date.now(),
            }
            return newSelectedItem
          }
          return item;
        }),
        selectedItem: newSelectedItem,
        isPanelOpen: false,
        isEditorPanelOpen: false,
      }
    }

    case LIST_ACTION.DELETE_ITEM: {
      let newSelectedItemIndex = 0;
      return {
        ...state,
        listItems: state.listItems.filter(
          (item, index) => {
            if (item.id === action.payload.listId) {
              newSelectedItemIndex = (index - 1) > 0 ? (index - 1) : 0;
              return false;
            }
            return true;
          }
        ),
        selectedItem: state.listItems[newSelectedItemIndex],
        isPanelOpen: true,
        isEditorPanelOpen: false,
      }
    }

    case LIST_ACTION.SELECT_ITEM: {
      const newSelectedItem = state.listItems.filter(
        (item) => item.id === action.payload.listId
      ).pop();
      return {
        ...state,
        selectedItem: newSelectedItem ?? null,
        isPanelOpen: false,
      }
    }

    case LIST_ACTION.TOGGLE_COMPLETED_ITEMS_VISIBILITY: {
      let newSelectedItem = null;
      return {
        ...state,
        listItems: state.listItems.map((item, index) => {
          if (item.id === action.payload.listId) {
            newSelectedItem = {
              ...item,
              is_completed_hidden: !item.is_completed_hidden,
            }
            return newSelectedItem;
          }
          return item;
        }),
        selectedItem: newSelectedItem,
      }
    }

    case LIST_ACTION.TOGGLE_PANEL: {
      return {
        ...state,
        isPanelOpen: !state.isPanelOpen,
      }
    }

    case LIST_ACTION.TOGGLE_EDITOR_PANEL: {
      return {
        ...state,
        isEditorPanelOpen: !state.isEditorPanelOpen,
      }
    }

    default:
      throw new Error();
  }
}
 
export { listReducer, LIST_ACTION, defaultList };