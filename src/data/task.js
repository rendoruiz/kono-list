const taskTemplate = {
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
    ...taskTemplate,
    id: 0,
    list_id: 0,
    title: 'List Item 1',
    note: 'List Item 1 note',
  },
  {
    ...taskTemplate,
    id: 1,
    list_id: 0,
    title: 'List Item 2',
    is_complete: true,
    note: 'List Item 2 note',
    date_updated: Date.now(),
  },
  {
    ...taskTemplate,
    id: 2,
    list_id: 0,
    title: 'List Item 3',
    note: 'List Item 3 note',
  },
  {
    ...taskTemplate,
    id: 3,
    list_id: 0,
    title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis.',
    note: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis.',
  },
  {
    ...taskTemplate,
    id: 4,
    list_id: 0,
    title: 'UOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
    note: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat voluptatum ipsum sapiente labore, quasi eum itaque tempora ex nesciunt corporis.',
  },
];

export { taskTemplate, initialTaskItems }