import preval from 'preval.macro'
import CrossIcon from './Icons/CrossIcon';

const buildVersion = `v${process.env.REACT_APP_MAJOR_VERSION}.${preval`module.exports = 
  new Date().getFullYear().toString().substr(2) + 
  (new Date().getMonth() < 10 ? '0' : '') + new Date().getMonth().toString() + 
  (new Date().getDate() < 10 ? '0' : '') + new Date().getDate().toString() +
  '.' + 
  (new Date().getHours() < 10 ? '0' : '') + new Date().getHours().toString() + 
  (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes().toString();`}
`;
const buildTime = preval`module.exports = 
  new Date().getFullYear().toString() + 
  '-' + (new Date().getMonth().toString().length < 10 ? '0' : '') + new Date().getMonth().toString() + 
  '-' + (new Date().getDate().toString().length < 10 ? '0' : '') + new Date().getDate().toString() +
  ' ' +
  (new Date().getHours() < 10 ? '0' : '') + new Date().getHours().toString() + 
  ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes().toString();
`;

const SettingsPanel = ({ 
  isOpen, 
  onTogglePanel,
  onResetCache
}) => {
  return isOpen && (  
    <div 
      className='fixed inset-0 z-50 grid place-items-center px-3 bg-black/60'
      onClick={onTogglePanel}
    >
      <div 
        className='grid content-start w-full max-w-lg text-black/90'
        onClick={(e) => e.stopPropagation()}
      >
        <header className='grid grid-cols-[1fr,auto] rounded-t p-4 bg-blue-600 text-white'>
          <div>
            <h2 className="mb-1 font-bold text-3xl tracking-tight md:text-3xl">
              KonoList
            </h2>
            <p className='font-mono text-xs tracking-wide'>
              {buildVersion}
            </p>
            <p className='font-mono text-xs'>
              Built on: {buildTime}
            </p>
          </div>

          <button
            type='button'
            title='Close settings'
            className='grid place-items-center rounded -mt-1 -mr-1 w-12 h-12 text-2xl hover:bg-black/10 active:bg-black/20 bp520:w-8 bp520:h-8 bp520:text-lg'
            onClick={onTogglePanel}
          >
            <CrossIcon className='w-6 h-6 stroke-current' />
          </button>
        </header>

        <main className='grid gap-5 content-start divide-y-2 rounded-b divide-slate-200 px-4 pt-5 pb-6 bg-white'>
          <section className=''>
            <h2 className='font-bold text-2xl'>About</h2>
            <p>This project is hosted on Netlify.</p>
          </section>

          <section className=' text-sm'>
            <h2 className='mt-2 mb-1 font-bold text-2xl'>Reset Cache</h2>
            <p className='tracking-wide'>This will delete all your lists and tasks and reset the app back to its defaults.</p>
            <p className='tracking-wide'>The page will be reload once the operation is finished.</p>
            <button 
              type='button'
              title='Reset cache'
              className='rounded mt-3 px-4 py-2 bg-red-600 text-white font-medium leading-none'
              onClick={onResetCache}
            >
              Reset Cache
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
 
export default SettingsPanel;