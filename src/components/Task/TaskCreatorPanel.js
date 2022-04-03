import * as React from 'react';

const TaskCreatorPanel = ({ 
  selectedList, 
  onCreateTask 
}) => {
  const [input, setInput] = React.useState("");

  const handleInputChange = (e) => setInput(e.target.value);
  const handleReset = () => setInput("");

  return (
    <footer className='sticky bottom-0 pt-2 pb-10 w-full bg-blue-200/90'>
      <form 
        className='relative overflow-hidden bg-blue-200'
        onSubmit={onCreateTask}
        onReset={handleReset}
      >
        {/* task title */}
        <input 
          name='title'
          type='text' 
          minLength={1}
          placeholder='Add a task'
          autoComplete='off'
          title={`Add a task on "${selectedList?.name}"`}
          className='peer rounded-md py-4 px-11 w-full bg-white/50 text-sm leading-none appearance-none outline-none placeholder:text-black/90 hover:bg-white/80 active:bg-white focus:bg-white'
          value={input}
          onChange={handleInputChange}
        />

        {/* task - decorative is_complete default state */}
        <div className={
          'absolute inset-0 right-auto hidden items-center px-3 pointer-events-none peer-focus:grid ' + 
          (input.length > 0 ? '!grid' : '')
        }>
          <div className='w-[18px] h-[18px] border-2 border-slate-700 rounded-full' />
        </div>

        {/* submit task */}
        <button
          type='submit'
          title={input.trim().length > 0 ? 'Add new task' : 'Invalid input'}
          className={
            'absolute inset-0 left-auto hidden px-2 cursor-pointer peer-focus:block ' + 
            (input.trim().length > 0 ? '!block' : '!cursor-not-allowed')
          }
          disabled={input.trim().length < 1}
        >
          <span className={
            'text-xl leading-none ' + 
            (input.trim().length > 0 ? 'opacity-90' : 'opacity-30')
          }>
            ⬆️
          </span> 
        </button>
      </form>
    </footer>
  );
}
 
export default TaskCreatorPanel;