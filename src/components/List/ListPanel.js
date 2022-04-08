/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import ListPanelRow from "./ListPanelRow";
import PlusIcon from "../Icons/PlusIcon";
import SettingsIcon from "../Icons/SettingsIcon";

const ListPanel = ({ 
  isOpen, 
  listItems, 
  selectedList, 
  onTogglePanel, 
  onSelectList, 
  onCreateList,
  onToggleSettingsPanel
}) => (
  <>
    {/* mobile backdrop toggle */}
    <div 
      className={
        'fixed inset-0 z-30 transition-opacity duration-300 bg-black/70 md:hidden ' +
        (isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full')
      }
      onClick={onTogglePanel}
    />

    {/* panel container */}
    <div className={
      'fixed inset-0 right-auto z-30 grid grid-rows-[auto,1fr,60px] w-full h-screen bg-slate-100 transition-transform duration-200 bp520:grid-rows-[auto,1fr,auto] bp520:w-72 md:relative md:z-auto md:translate-x-0 md:transition-none  ' +
      (isOpen ? 'md:translate-x-0' : '-translate-x-full')
    }>
      <header className='sticky top-0 grid border-b-2 pt-4 pb-3 px-3 leading-none select-none pointer-events-none md:py-3'>
        <h1 className="bg-gradient-to-br from-blue-700 to-blue-500 bg-clip-text font-extrabold text-2xl text-transparent leading-none tracking-wide uppercase">
          KonoList
        </h1>
      </header>
      
      {/* list rows */}
      <main className='overflow-y-auto pt-3 py-1 bp520:pt-2'>
        <ul className='grid content-start'>
          {listItems.map((list) => (
            <ListPanelRow
              key={list.id}
              list={list}
              selectedList={selectedList}
              onSelectList={onSelectList}
            />
          ))}
        </ul>
      </main>

      <footer className='fixed inset-0 top-auto grid grid-cols-[1fr,auto] border-t-2 p-[2px] bg-inherit text-black/70 bp520:sticky'>
        {/* add new list button */}
        <button 
          type='button'
          title='New list: add a list'
          onClick={onCreateList}
          className='group grid p-[2px] leading-none'
        >
          <div className='grid grid-cols-[auto,1fr] items-center rounded w-full group-hover:bg-slate-500/10 group-active:bg-slate-500/30'>
            <div className='grid place-items-center p-2 w-12 h-12 bp520:w-10 bp520:h-10'>
              <PlusIcon className='w-7 h-7 stroke-current bp520:w-6 bp520:h-6' />
            </div>
            <span className='text-left'>New list</span>
          </div>
        </button>

        <button
          type='button'
          title='Open settings'
          onClick={onToggleSettingsPanel}
          className='group grid p-[2px] leading-none'
        >
          <div className='grid place-items-center rounded w-12 h-12 group-hover:bg-slate-500/10 group-active:bg-slate-500/30 bp520:w-10 bp520:h-10'>
            <SettingsIcon className='w-7 h-7 stroke-current bp520:w-6 bp520:h-6' />
          </div>
        </button>
      </footer>
    </div>
  </>
);
 
export default ListPanel;