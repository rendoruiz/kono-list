const taskItemTemplate = {
  id: null,
  list_id: null,
  is_checked: false,
  date_created: Date.now(),
  date_updated: null,
  title: null,
  note: null,
}

const initialTaskItems = [
  {
    ...taskItemTemplate,
    id: 0,
    list_id: 0,
    title: 'List Item 1',
    note: 'List Item 1 note',
  },
  {
    ...taskItemTemplate,
    id: 1,
    list_id: 0,
    is_checked: true,
    title: 'List Item 2',
    note: 'List Item 2 note',
  },
  {
    ...taskItemTemplate,
    id: 2,
    list_id: 0,
    title: 'List Item 3',
    note: 'List Item 3 note',
  },
];

export { taskItemTemplate, initialTaskItems }