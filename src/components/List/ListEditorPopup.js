import * as React from 'react';

import { listTemplate } from '../../data/list';

const ListEditorPopup = ({ 
  isOpen, 
  list, 
  onUpdateList, 
  onCancelEdit
}) => {
  const [name, setName] = React.useState("");
  const [icon, setIcon] = React.useState("");

  // make sure the form fields are up to date whenever the editor is opened
  React.useEffect(() => {
    if (isOpen && list) {
      setName(list.name ?? "");
      if (list.date_updated) {
        setIcon(list.icon ?? "");
      }
    }
  }, [isOpen, list]);

  const handleNameChange = (e) => setName(e.target.value);
  const handleBadgeChange = (e) => setIcon(e.target.value);
  const handleClick = (e) => e.target.select();

  const handleSubmit = (event) => {
    onUpdateList({
      name: name.trim(),
      icon: icon.trim(),
    });
    if (event) {
      event.target.reset();
      event.preventDefault();
    } else {
      handleReset();
    }
  }

  const handleReset = () => {
    setName("");
    setIcon("");
  }

  return isOpen && (
    <div
      className='fixed inset-0 z-50 grid place-items-center bg-black/40'
      onClick={() => handleSubmit()}
    >
      <form 
        className=' rounded px-4 py-3 bg-white'
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <h2 className='font-medium text-lg'>
          {!list.date_updated ? 'New' : 'Rename'} list
        </h2>
        
        <div className='flex mt-3 w-full'>
          <input 
            name='icon'
            type='text' 
            maxLength={1}
            placeholder={listTemplate.icon}
            autoComplete='off'
            className='flex-none border-b-2 border-b-blue-600 rounded-b-sm w-8 h-8 text-lg text-center leading-none appearance-none outline-none placeholder:opacity-40 active:select-all'
            value={icon}
            onChange={handleBadgeChange}
            onClick={handleClick}
          />
          <input 
            name='name'
            type='text'
            placeholder={listTemplate.name}
            autoComplete='off'
            className='flex-1 border-b-2 border-b-blue-600 rounded-b-sm ml-2 px-1 w-full appearance-none outline-none placeholder:opacity-40'
            value={name}
            onChange={handleNameChange}
            onClick={handleClick}
          />
        </div>

        <div className='grid grid-flow-col items-center justify-end gap-1 mt-4 text-sm'>
          <button 
            type='submit' 
            className='rounded px-2 py-1 font-medium text-blue-600 uppercase cursor-pointer hover:bg-black/10'
            disabled={name?.trim().length < 1}
          >
            {!list.date_updated ? 'Create List' : 'Save'} 
          </button>
          <button 
            type='button'
            onClick={onCancelEdit}
            className='-order-1 rounded px-2 py-1 font-medium uppercase hover:bg-black/10'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
 
export default ListEditorPopup;