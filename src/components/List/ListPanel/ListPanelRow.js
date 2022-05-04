/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';

import { APP_LIST_ID } from "../../../data/list";

const SortableListPanelRow = ({
  list, 
  selectedList, 
  onSelectList,
  activeDragItemId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: list.id, 
    disabled: list.locked,
  });
  const sortableItemAttributes = list.locked ? null : {
    ref: setNodeRef,
    style: list.locked ? null : {
      transform: CSS.Transform.toString(transform),
      transition,
    },
    ...attributes,
    ...listeners,
    className: (
      list.id === APP_LIST_ID.TASKS ? 'pb-[2px] mb-[2px] border-b-[2px]' : '' +
      ((activeDragItemId === list.id) ? ' relative z-[1]' : '')
    ),
  }
  const sortableButtonClass = list.locked ? '' : (
    ' ease-in-out duration-300 bp520:transition bp520:origin-center bp520:delay-100 ' +
    ((activeDragItemId && (activeDragItemId !== list.id)) ? 'bp520:scale-x-95 bp520:scale-y-90 bp520:opacity-60' : '')
  );
  const sortableButtonBackplateClass = list.locked ? '' : (
    ' transition ' +
    ((activeDragItemId === list.id) ? 'bg-white shadow-md shadow-black/25 bp520:shadow-none' : '')
  );

  return (
    <ListPanelRow
      list={list} 
      selectedList={selectedList} 
      onSelectList={onSelectList}
      activeDragItemId={activeDragItemId}
      sortableAttributes={sortableItemAttributes}
      sortableButtonClass={sortableButtonClass}
      sortableButtonBackplateClass={sortableButtonBackplateClass}
    />
  );
}

const ListPanelRow = ({ 
  list, 
  selectedList, 
  onSelectList,
  activeDragItemId,
  ...props
}) => (
  <li {...props.sortableAttributes}>
    <button 
      className={
        'group grid w-full px-2 py-[2px] select-none' +
        (props.sortableButtonClass ? props.sortableButtonClass : '')
      }
      onClick={() => onSelectList(list.id)}
    >
      <div className={
        'relative grid grid-cols-[auto,1fr] items-center rounded-sm py-1 bp520:rounded bp520:py-0 bp520:group-hover:bg-slate-500/10 bp520:group-active:bg-slate-500/20 ' + 
        (selectedList?.id === list.id ? 'bp520:bg-slate-500/10 bp520:before:absolute bp520:before:inset-y-3 bp520:before:left-0 bp520:before:rounded-full bp520:before:w-1 bp520:before:bg-blue-600' : '') +
        (props.sortableButtonBackplateClass ? props.sortableButtonBackplateClass : '')
      }>
        <ListIcon icon={list.icon} />
        <ListName name={list.name} />
      </div>
    </button>
  </li>
);

const ListIcon = ({ icon }) => (
  <div className='grid place-items-center w-10 h-10'>
    <span className='font-mono text-lg leading-none'>
      {icon}
    </span>
  </div>
);

const ListName = ({ name }) => (
  <p className='text-left truncate'>
    {name}
  </p>
);

export { ListPanelRow, SortableListPanelRow };