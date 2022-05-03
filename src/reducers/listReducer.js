/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import { arrayMove } from "@dnd-kit/sortable";
import { listTemplate, initialListItems, appDefaultListItems } from "../data/list";
import { getDecryptedList } from "../utils/encryptedStorage";

const storedList = getDecryptedList();
const defaultList = {
  listItems: storedList?.listItems ?? [...appDefaultListItems, ...initialListItems], 
  appListItems: storedList?.appListItems ?? appDefaultListItems,
  userListItems: storedList?.userListItems ?? initialListItems,
  selectedItem: storedList?.selectedItem ?? appDefaultListItems[0],
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
  UPDATE_INDICES: 'update_item_indices',
}

const listReducer = (state, action) => {
  switch (action.type) {
    case LIST_ACTION.CREATE_ITEM: {
      const newItem = {
        ...listTemplate,
        id: action.payload.listId,
      }
      const newUserListItems = [...state.userListItems, newItem];
      return {
        ...state,
        listItems: [...state.appListItems, ...newUserListItems],
        userListItems: newUserListItems,
        selectedItem: newItem,
        isEditorPanelOpen: true,
      }
    }

    case LIST_ACTION.UPDATE_ITEM: {
      let newSelectedItem = null;
      const newName = action.payload.name.trim();
      const newUserListItems = state.userListItems.map((item) => {
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
        });
      return {
        ...state,
        listItems: [...state.appListItems, ...newUserListItems],
        userListItems: newUserListItems,
        selectedItem: newSelectedItem,
        isPanelOpen: false,
        isEditorPanelOpen: false,
      }
    }

    case LIST_ACTION.DELETE_ITEM: {
      let newSelectedItemIndex = 0;
      const newUserListItems = state.userListItems.filter(
          (item, index) => {
            if (item.id === action.payload.listId) {
              newSelectedItemIndex = (index - 1) > 0 ? (index - 1) : 0;
              return false;
            }
            return true;
          }
        );
      return {
        ...state,
        listItems: [...state.appListItems, ...newUserListItems],
        userListItems: newUserListItems,
        selectedItem: state.userListItems[newSelectedItemIndex],
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
      const newAppListItems = state.appListItems.map((item) => {
          if (item.id === action.payload.listId) {
            newSelectedItem = {
              ...item,
              is_completed_hidden: !item.is_completed_hidden,
            }
            return newSelectedItem;
          }
          return item;
        });
      const newUserListItems = state.userListItems.map((item) => {
          if (item.id === action.payload.listId) {
            newSelectedItem = {
              ...item,
              is_completed_hidden: !item.is_completed_hidden,
            }
            return newSelectedItem;
          }
          return item;
        });
      return {
        ...state,
        listItems: [...newAppListItems, ...newUserListItems],
        appListItems: newAppListItems,
        userListItems: newUserListItems,
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

    // If item being dragged is an app default list, do nothing.
    // If item is dragged to an app default list, place on top of user list.
    case LIST_ACTION.UPDATE_INDICES: {
      const activeListId = action.payload.activeListId;
      const isActiveListDefaultAppList = state.appListItems.filter((item) => item.id === activeListId).pop();
      if (isActiveListDefaultAppList) {
        return { ...state }
      }
      
      const overListId = action.payload.overListId;
      const isOverListDefaultAppList = state.appListItems.filter((item) => item.id === overListId).pop();
      const newIndex = isOverListDefaultAppList 
        ? state.userListItems.slice(0, 1) 
        : state.userListItems
          .map((item) => item.id)
          .indexOf(overListId);
      const currentIndex = state.userListItems
        .map((item) => item.id)
        .indexOf(activeListId);
      const newUserListItems = arrayMove(state.userListItems, currentIndex, newIndex);

      return {
        ...state,
        listItems: [...state.appListItems, ...newUserListItems],
        userListItems: newUserListItems,
      }
    }

    default:
      throw new Error();
  }
}
 
export { listReducer, LIST_ACTION, defaultList };