/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import CircleCheckIcon from "../Icons/CircleCheckIcon";

const TaskCompletedToggle = ({ 
  task, 
  onToggle,
  ...props
}) => (  
  <button
    type='button'
    title={'Toggle complete task - mark as ' + (task?.is_complete ? 'incomplete' : 'complete')}
    onClick={() => onToggle(task)}
    className="group py-1 px-3 bp520:px-3"
    {...props}
  >
    <CircleCheckIcon 
      className='w-8 h-8 bp520:w-6 bp520:h-6' 
      circleClassName={'stroke-[1.5] bp520:stroke-2 ' + (task?.is_complete ? 'fill-blue-500 stroke-blue-500 group-active:stroke-black/60 group-active:fill-transparent' : 'stroke-black/60 group-active:fill-black/60')}
      checkClassName={'stroke-2 ' + (task?.is_complete ? 'stroke-white group-hover:opacity-50 group-active:opacity-0' : 'stroke-black/60 opacity-0 group-hover:opacity-80 group-active:stroke-white group-active:opacity-100')}
    />
  </button>
);
 
export default TaskCompletedToggle;