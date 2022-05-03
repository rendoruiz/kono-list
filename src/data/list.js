const listTemplate = {
  id: null,
  name: 'Untitled list',
  icon: '📃',
  date_created: Date.now(),
  date_updated: null,
  is_completed_hidden: false,
  locked: false,
}

const APP_LIST_ID = {
  TASKS: 'konolist-tasks',
}

const appDefaultListItems = [
  {
    ...listTemplate,
    id: APP_LIST_ID.TASKS,
    name: "Tasks",
    icon: "⭐",
    date_updated: Date.now(),
    locked: true,
  },
];

const initialListItems = [];

export { listTemplate, appDefaultListItems, initialListItems, APP_LIST_ID }