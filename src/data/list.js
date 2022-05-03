const APP_LIST_ID = {
  TASKS: 'konolist-tasks',
}

const listTemplate = {
  id: null,
  name: 'Untitled list',
  icon: '📃',
  date_created: Date.now(),
  date_updated: null,
  is_completed_hidden: false,
  locked: false,
}

const initialListItems = [
  {
    ...listTemplate,
    id: APP_LIST_ID.TASKS,
    name: "Tasks",
    icon: "⭐",
    date_updated: Date.now(),
    locked: true,
  },
];

export { listTemplate, initialListItems, APP_LIST_ID }