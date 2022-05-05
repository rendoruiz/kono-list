/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import * as React from 'react';
import clsx from 'clsx';

import CircleCheckIcon from '../../Icons/CircleCheckIcon';
import PlusIcon from '../../Icons/PlusIcon';
import SendIcon from '../../Icons/SendIcon';

const TaskPanelCreator = ({ 
  selectedList, 
  onCreateTask 
}) => {
  const [input, setInput] = React.useState("");

  const handleInputChange = (e) => setInput(e.target.value);
  const handleReset = () => setInput("");
  const handleSubmit = (e) => {
    onCreateTask({ title: input });
    e.preventDefault();
    e.target.reset();
  }

  return (
    <footer className='fixed bottom-0 w-full leading-none md:sticky md:pt-[6px] md:pb-10 md:text-sm'>
      <form 
        className='relative overflow-hidden'
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        {/* task title */}
        <input 
          name='title'
          type='text' 
          minLength={1}
          required
          placeholder='Add a task'
          autoComplete='off'
          title={`Add a task on "${selectedList?.name}"`}
          className='peer relative px-16 py-5 w-full bg-white text-black/90 appearance-none outline-none placeholder:text-black/90 md:px-12 md:py-[15px] md:rounded-md md:bg-white/80 md:hover:bg-white/90 md:active:bg-white md:focus:bg-white'
          value={input}
          onChange={handleInputChange}
        />

        {/* default/unfocused icon */}
        <PlusIcon className='absolute inset-y-0 left-6 my-auto w-6 h-6 stroke-black/60 peer-valid:hidden peer-focus:hidden md:left-3' />

        {/* focused icon */}
        <CircleCheckIcon
          className='absolute inset-y-0 left-5 grid items-center my-auto w-8 h-8 pointer-events-none peer-placeholder-shown:hidden peer-focus:grid bp520:w-6 bp520:h-6 md:left-3'
          circleClassName='stroke-[1.5] stroke-black/60 bp520:stroke-2'
          checkClassName='hidden'
        />

        {/* submit task */}
        <button
          type='submit'
          title={input.trim().length > 0 ? 'Add new task' : 'Invalid input'}
          className={clsx(
            'absolute inset-y-0 left-auto right-3 hidden px-2 cursor-pointer peer-focus:block md:right-0 md:px-2',
            input.trim().length > 0 
              ? '!block' 
              : '!cursor-not-allowed opacity-25',
          )}
          disabled={input.trim().length < 1}
        >
          <SendIcon 
            className='w-8 h-8 bp520:w-7 bp520:h-7' 
            arrowClassName='stroke-white'
            bgClassName='fill-blue-500'
            rectClassName='stroke-blue-500'
          />
        </button>
      </form>
    </footer>
  );
}
 
export default TaskPanelCreator;