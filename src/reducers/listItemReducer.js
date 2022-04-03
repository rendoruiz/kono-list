import { listItemTemplate } from "../data/listItem";

const listItemReducer = (state, action) => {
  let newState;

  switch(action.type) {
    case 'LIST_CREATE':
      const newList = {
        ...listItemTemplate,
        id: action.payload.id,
      };
      newState = { 
        ...state,
        data: [...state.data, newList],
      };
      break;

    case 'LIST_UPDATE':
      newState = {
        ...state,
        data: state.data.map((list) => {
          if (list.id === action.payload.id) {
            return {
              ...list,
              name: action.payload.name ?? list.name,
              badge: action.payload.badge ?? list.badge,
              is_completed_hidden: action.payload.is_completed_hidden ?? list.is_completed_hidden,
              date_updated: Date.now(),
            }
          }
          return list;
        }),
      }
      break;

    case 'LIST_DELETE':
      newState = {
        ...state,
        data: state.data.filter(
          (list) => list.id !== action.payload.id
        ),
      };
      break;

    default:
      throw new Error();
  }

  localStorage.setItem(state.localKey, JSON.stringify(newState.data));
  return newState;
}
 
export default listItemReducer;