/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import { taskTemplate } from "../data/task";
import { encryptObject } from "../utils/cryptoJs";

const taskReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'TASK_CREATE':
      const newTask = {
        ...taskTemplate,
        id: action.payload.id,
        list_id: action.payload.list_id,
        title: action.payload.title,
      };
      newState = { 
        ...state,
        data: [...state.data, newTask],
      };
      break;

    case 'TASK_UPDATE':
      newState = {
        ...state,
        data: state.data.map((task) => {
          if (task.id === action.payload.id) {
            return {
              ...task,
              list_id: action.payload.list_id ?? task.list_id,
              title: action.payload.title ?? task.title,
              is_complete: action.payload.is_complete ?? task.is_complete,
              note: action.payload.note ?? "",
              date_updated: Date.now(),
            }
          }
          return task;
        }),
      }
      break;

    case 'TASK_DELETE':
      newState = {
        ...state,
        data: state.data.filter(
          (task) => task.id !== action.payload.id
        ),
      };
      break;

    case 'LIST_TASKS_DELETE':
      newState = {
        ...state,
        data: state.data.filter(
          (task) => task.list_id !== action.payload.list_id
        ),
      }
      break;

    default:
      throw new Error();
  }

  localStorage.setItem(state.localKey, encryptObject(newState.data));
  return newState;
}
 
export default taskReducer;