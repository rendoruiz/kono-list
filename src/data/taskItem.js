const taskItemTemplate = {
  id: null,
  list_id: null,
  title: null,
  is_complete: false,
  note: null,
  date_created: Date.now(),
  date_updated: null,
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
    title: 'List Item 2',
    is_complete: true,
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