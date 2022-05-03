/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';

const ListPanelRow = ({ 
  list, 
  selectedList, 
  isSortable,
  dragItemId,
  onSelectList,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable(
    {id: isSortable && list.id}
  );
  const sortableItemAttributes = !isSortable ? null : {
    ref: setNodeRef,
    style: {
      transform: CSS.Transform.toString(transform),
      transition,
    },
    ...attributes,
    ...listeners,
  }
  const sortableButtonStyle = !isSortable ? '' : (
    'transition origin-center ease-in-out delay-100 duration-300 ' +
    ((dragItemId && (dragItemId !== list.id)) ? 'scale-x-[0.925] scale-y-90 opacity-60' : '')
  );
  

  return (
    <li {...sortableItemAttributes}>
      <button 
        className={
          'group grid w-full px-2 py-[2px] select-none ' +
          sortableButtonStyle
        }
        onClick={() => onSelectList(list.id)}
      >
        {/* backplate */}
        <div className={
          'relative grid grid-cols-[auto,1fr] items-center rounded py-1 group-hover:bg-slate-500/10 group-active:bg-slate-500/20 bp520:py-0 ' + 
          (selectedList?.id === list.id ? 'bg-slate-500/10 before:absolute before:inset-y-3 before:left-0 before:rounded-full before:w-1 before:bg-blue-600' : '')}
        >
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