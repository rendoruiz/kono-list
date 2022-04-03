import { taskTemplate } from "../data/taskItem";

const taskReducer = (state, action) => {
  let newState;

  switch(action.type) {
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
              note: action.payload.note ?? task.note,
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

    default:
      throw new Error();
  }

  localStorage.setItem(state.localKey, JSON.stringify(newState.data));
  return newState;
}
 
export default taskReducer;