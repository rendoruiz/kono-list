const listTemplate = {
  id: null,
  name: 'Untitled list',
  badge: '📃',
  date_created: Date.now(),
  date_updated: null,
  is_completed_hidden: false,
}

const initialListItems = [
  {
    ...listTemplate,
    id: 0,
    name: "Tasks",
    badge: "⭐",
  },
];

export { listTemplate, initialListItems }