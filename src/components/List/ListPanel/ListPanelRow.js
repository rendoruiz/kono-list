/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';

import { APP_LIST_ID } from "../../../data/list";

const ListPanelRow = ({ 
  list, 
  selectedList, 
  dragItemId,
  onSelectList,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: list.id, 
    disabled: list.locked,
  });
  const sortableItemAttributes = {
    ref: setNodeRef,
    style: {
      transform: CSS.Transform.toString(transform),
      transition,
    },
    ...attributes,
    ...listeners,
  }
  const sortableButtonClass = (
    'ease-in-out duration-300 transform-none bp520:transition bp520:origin-center bp520:delay-100 ' +
    ((dragItemId && (dragItemId !== list.id)) ? 'bp520:scale-x-[0.925] bp520:scale-y-90 bp520:opacity-60' : '')
  );
  const sortableButtonBackplateClass = (
    ' transition ' +
    ((dragItemId === list.id) ? 'shadow-md shadow-black/25 bp520:shadow-none' : '')
  );

  const appDefaultListDividerClass = list.id === APP_LIST_ID.TASKS ? 'pb-[2px] mb-[2px] border-b-[2px]' : '';

  return (
    <li 
      {...sortableItemAttributes}
      className={appDefaultListDividerClass}
    >
      <button 
        className={
          'group grid w-full px-2 py-[2px] select-none ' +
          sortableButtonClass
        }
        onClick={() => onSelectList(list.id)}
      >
        {/* backplate */}
        <div className={
          'relative grid grid-cols-[auto,1fr] items-center rounded-sm py-1 group-hover:bg-slate-500/10 bp520:rounded bp520:py-0 bp520:group-active:bg-slate-500/20 ' + 
          (selectedList?.id === list.id ? 'bg-slate-500/10 before:absolute before:inset-y-3 before:left-0 before:rounded-full before:w-1 before:bg-blue-600' : '') +
          sortableButtonBackplateClass
        }>
          {/* list icon */}
          <div className='grid place-items-center w-10 h-10'>
            <span className='font-mono text-lg leading-none'>
              {list.icon}
            </span>
          </div>
          
          {/* list name */}
          <p className='text-left truncate'>
            {list.name}
          </p>
        </div>
      </button>
    </li>
  );
}

export default ListPanelRow;