/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import { listTemplate } from "../data/list";
import { encryptObject } from "../utils/cryptoJs";

const LIST_ACTION = {
  CREATE_ITEM: 'create_item',
  UPDATE_ITEM: 'update_item',
  DELETE_ITEM: 'delete_item',
  SELECT_ITEM: 'select_item',
  TOGGLE_COMPLETED_ITEMS_VISIBILITY: 'toggle_completed_items_visibility',
  TOGGLE_EDITOR_PANEL: 'toggle_editor_panel',
}

const listReducer = (state, action) => {
  switch (action.type) {
    case LIST_ACTION.CREATE_ITEM:
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

    case LIST_ACTION.UPDATE_ITEM:
      return {
        ...state,
        listItems: state.data.map((item) => {
          if (item.id === action.payload.listId) {
            return {
              ...item,
              name: action.payload.name ?? item.name,
              icon: action.payload.icon ?? item.icon,
              date_updated: Date.now(),
            }
          }
          return item;
        }),
        isEditorPanelOpen: false,
      }

    case LIST_ACTION.DELETE_ITEM: 
      let newSelectedItemIndex = 0;
      return {
        ...state,
        listItems: state.listItems.filter(
          (item, index) => {
            if (item.id === action.payload.listId) {
              itemIndex = (index - 1) > 0 ? (index - 1) : 0;
              return false;
            }
            return true;
          }
        ),
        selectedItem: state.listItems[newSelectedItemIndex],
        isEditorPanelOpen: false,
      }

    case LIST_ACTION.SELECT_ITEM:
      const newSelecteItem = state.listItems.filter(
        (item) => item.id === action.payload.listId
      );
      return {
        ...state,
        selectedItem: newSelecteItem,
        isPanelOpen: false,
      }

    case LIST_ACTION.TOGGLE_COMPLETED_ITEMS_VISIBILITY:
      return {
        ...state,
        listItems: state.data.map((item) => {
          if (item.id === action.payload.listId) {
            return {
              ...item,
              is_completed_hidden: !item.is_completed_hidden,
            }
          }
          return item;
        }),
      }

    case LIST_ACTION.TOGGLE_EDITOR_PANEL:
      return {
        ...state,
        isEditorPanelOpen: !state.isEditorPanelOpen,
      }

    default:
      throw new Error();
  }
}
 
export { listReducer, LIST_ACTION };