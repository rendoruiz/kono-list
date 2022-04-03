const initialListItems = [
  {
    id: 0,
    name: "Tasks",
    date_created: Date.now(),
    date_updated: null,
    badge: "⭐",
    is_checked_hidden: false,
  },
];

const listItemTemplate = {
  id: null,
  name: 'Untitled list',
  badge: '📃',
  date_created: Date.now(),
  date_updated: null,
}

export { initialListItems, listItemTemplate }