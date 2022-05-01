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
    id: 0,
    name: "Tasks",
    icon: "⭐",
    date_updated: Date.now(),
    locked: true,
  },
];

const storedList = JSON.parse(localStorage.getItem('list'));
const defaultList = {
  listItems: storedList?.listItems ?? initialListItems, 
  selectedItem: storedList?.selectedItem ?? initialListItems[0],
  isPanelOpen: storedList?.isPanelOpen ?? true,
  isEditorPanelOpen: false,
}

export { listTemplate, initialListItems, defaultList }