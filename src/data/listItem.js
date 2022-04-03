const listItemTemplate = {
  id: null,
  name: 'Untitled list',
  badge: '📃',
  date_created: Date.now(),
  date_updated: null,
  is_checked_hidden: false,
}

const initialListItems = [
  {
    ...listItemTemplate,
    id: 0,
    name: "Tasks",
    badge: "⭐",
  },
];

export { listItemTemplate, initialListItems }