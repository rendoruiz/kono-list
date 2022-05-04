import { APP_LIST_ID } from "./list";

const taskTemplate = {
  id: null,
  list_id: null,
  title: null,
  is_complete: false,
  notes: null,
  date_created: Date.now(),
  date_updated: null,
}

const initialTaskItems = [
  {
    ...taskTemplate,
    id: 'sample-item-1',
    list_id: APP_LIST_ID.TASKS,
    title: 'List Item 1',
    date_created: 1644078770000,
  },
  {
    ...taskTemplate,
    id: 'sample-item-2',
    list_id: APP_LIST_ID.TASKS,
    title: 'List Item 2',
    is_complete: true,
    notes: 'List Item 2 note',
    date_updated: Date.now(),
  },
  {
    ...taskTemplate,
    id: 'sample-item-3',
    list_id: APP_LIST_ID.TASKS,
    title: 'List Item 3',
    notes: 'List Item 3 note',
    date_created: 1612542770000,
  },
];

export { taskTemplate, initialTaskItems }