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
    id: 0,
    list_id: 0,
    title: 'List Item 1',
    date_created: 1644078770000,
  },
  {
    ...taskTemplate,
    id: 1,
    list_id: 0,
    title: 'List Item 2',
    is_complete: true,
    notes: 'List Item 2 note',
    date_updated: Date.now(),
  },
  {
    ...taskTemplate,
    id: 2,
    list_id: 0,
    title: 'List Item 3',
    notes: 'List Item 3 note',
    date_created: 1612542770000,
  },
];

const storedTask = JSON.parse(localStorage.getItem('task'));
const defaultTask = {
  taskItems: storedTask?.taskItems ?? initialTaskItems,
  selectedItem: storedTask?.selectedItem ?? null,
  isEditorPanelOpen: false,
}

export { taskTemplate, initialTaskItems, defaultTask }