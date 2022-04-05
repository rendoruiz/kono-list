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
      className='fixed inset-0 z-50 grid place-items-center overflow-y-auto px-3 py-5 bg-black/60'
      onClick={onTogglePanel}
    >
      <div 
        className='grid content-start w-full max-w-md text-black/90'
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
            className='grid place-items-center rounded -mt-2 -mr-2 w-12 h-12 text-2xl hover:bg-black/10 active:bg-black/20 bp520:w-8 bp520:h-8 bp520:text-lg'
            onClick={onTogglePanel}
          >
            <CrossIcon className='w-8 h-8 stroke-current bp520:w-6 bp520:h-6' />
          </button>
        </header>

        <main className='grid gap-8 content-start rounded-b px-4 pt-5 pb-6 bg-white'>
          <section className='grid content-start gap-4'>
            <div className='grid justify-items-start gap-1'>
              <h2 className='font-bold text-2xl tracking-tight'>
                About
              </h2>
              <p>
                This is a simple list web app that allows you to create as many lists and tasks as you like. With your data staying on your device's browser, protected.
              </p>
            </div>

            <div className='grid justify-items-start gap-1'>
              <h3 className='font-medium text-lg tracking-tight'>Netlify deployment status</h3>

              <a 
                href='https://list.kono.cx/'
                title='Open site link'
                className='block rounded scale-110 origin-left hover:opacity-80 active:opacity-100 active:outline active:outline-blue-600 active:outline-offset-2'
              >
                <img 
                  src='https://api.netlify.com/api/v1/badges/19cdecd2-08f5-4507-a6e1-126b61977fc2/deploy-status' 
                  alt='Netlify deployment status'
                />
              </a>
            </div>

            <div className='grid justify-items-start gap-1'>
              <h3 className='font-medium text-lg tracking-tight'>Give the project a star on GitHub</h3>
              <a 
                href='https://github.com/rendoruiz/konolist'
                title='Open GitHub link'
                target='_blank'
                rel='noreferrer'
                className='rounded px-4 py-2 bg-black text-white font-medium leading-none hover:opacity-80 active:opacity-100 active:outline active:outline-blue-600 active:outline-offset-2'
              >
                Fork at GitHub
              </a>
            </div>
          </section>

          <section>
            <h2 className='mb-1 font-bold text-2xl tracking-tight'>Reset Cache</h2>
            <p>This will delete all your lists and tasks and reset the app back to its defaults.</p>
            <p>The page will be reload once the operation is finished.</p>
            <button 
              type='button'
              title='Reset cache'
              className='rounded mt-4 px-4 py-2 bg-red-600 text-white font-medium leading-none hover:opacity-80 active:opacity-100 active:outline active:outline-blue-600 active:outline-offset-2'
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