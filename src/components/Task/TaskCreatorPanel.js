import * as React from 'react';

const TaskCreatorPanel = ({ 
  selectedList, 
  onCreateTask 
}) => {
  const [input, setInput] = React.useState("");

  const handleInputChange = (e) => setInput(e.target.value);
  const handleReset = () => setInput("");

  return (
    <footer className='fixed bottom-0 w-full bg-blue-200/90 md:sticky md:pt-[6px] md:pb-10'>
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
          className='peer px-[50px] py-3 w-full bg-white text-sm leading-none appearance-none outline-none placeholder:text-black/90 md:px-11 md:py-4 md:rounded-md md:bg-white/50 md:hover:bg-white/80 md:active:bg-white md:focus:bg-white'
          value={input}
          onChange={handleInputChange}
        />

        {/* task - decorative is_complete default state */}
        <div className={
          'absolute inset-0 right-auto hidden items-center px-5 pointer-events-none peer-focus:grid md:px-3 ' + 
          (input.length > 0 ? '!grid' : '')
        }>
          <div className='w-[18px] h-[18px] border-2 border-slate-700 rounded-full' />
        </div>

        {/* submit task */}
        <button
          type='submit'
          title={input.trim().length > 0 ? 'Add new task' : 'Invalid input'}
          className={
            'absolute inset-0 left-auto hidden px-4 cursor-pointer peer-focus:block md:px-2 ' + 
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