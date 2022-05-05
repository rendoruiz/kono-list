/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import * as React from 'react';
import preval from 'preval.macro'

import CrossIcon from './Icons/CrossIcon';

// for settings build stuff
const buildVersion = `${process.env.REACT_APP_MAJOR_VERSION}.${process.env.REACT_APP_MINOR_VERSION}`;
const buildTime = preval`module.exports = 
  new Date().getFullYear().toString() + 
  '-' + (new Date().getMonth().toString().length < 10 ? '0' : '') + new Date().getMonth().toString() + 
  '-' + (new Date().getDate().toString().length < 10 ? '0' : '') + new Date().getDate().toString() +
  ' ' +
  (new Date().getHours() < 10 ? '0' : '') + new Date().getHours().toString() + 
  ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes().toString();
`;

// for pwa install button
let deferredPrompt; 

const AppSettingsPanel = ({ 
  isOpen,
  onToggle,
}) => {
  // pwa install button state
  const [isPWAInstallable, setIsPWAInstallable] = React.useState(false);

  // pwa install button effect
  // prevent browser install prompt from appearing and capture its event for later use
  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setIsPWAInstallable(true);
    });
  }, []);

  // toggle installable flag and show the captured prompt from useeffect
  const handleInstallPWA = () => {
    setIsPWAInstallable(false);
    deferredPrompt.prompt();
  }

  // clear localstorage + reroute to page origin
  const handleResetCache = (event) => {
    if (window.confirm('Are you sure you want to reset everything back to default?')) {
      localStorage.clear();
      window.location.assign(window.location.origin);
    }
    event.preventDefault();
  }

  return isOpen && (  
    <div 
      className='fixed inset-0 z-50 grid place-items-center overflow-y-auto px-3 py-5 bg-black/60'
      onClick={onToggle}
    >
      <div 
        className='grid content-start w-full max-w-lg text-black/90'
        onClick={(e) => e.stopPropagation()}
      >
        <header className='grid grid-cols-[1fr,auto] rounded-t p-4 bg-gradient-to-br from-blue-700 to-blue-500 text-white'>
          <div>
            <h2 className="mb-1 font-extrabold text-3xl uppercase">
              KonoList
            </h2>
            <p className='font-mono text-xs tracking-wide'>
              Version: {buildVersion}
            </p>
            <p className='font-mono text-xs'>
              Built on: {buildTime}
            </p>
          </div>

          <button
            type='button'
            title='Close settings'
            className='grid place-items-center rounded -mt-2 -mr-2 w-12 h-12 text-2xl hover:bg-black/10 active:bg-black/20 bp520:w-8 bp520:h-8 bp520:text-lg'
            onClick={onToggle}
          >
            <CrossIcon className='w-8 h-8 stroke-current bp520:w-6 bp520:h-6' />
          </button>
        </header>

        <main className='grid gap-10 content-start rounded-b px-4 pt-5 pb-8 bg-white'>
          <section className='grid content-start gap-5'>
            <div className='grid justify-items-start gap-1'>
              <h2 className='font-bold text-2xl tracking-tight'>
                About
              </h2>
              <p>
                Konolist is a simple list web app that allows you to create as many lists and tasks as you need. Your data is kept solely on your device's browser, protected.
              </p>
            </div>

            <div className='grid justify-items-start gap-1'>
              <h3 className='font-medium text-lg tracking-tight'>
                Netlify deployment status
              </h3>

              <a 
                href='https://list.kono.cx/'
                title='Open site link'
                className='block rounded scale-110 origin-left hover:opacity-80 active:outline active:outline-blue-600 active:outline-offset-2'
              >
                <img 
                  src='https://api.netlify.com/api/v1/badges/19cdecd2-08f5-4507-a6e1-126b61977fc2/deploy-status' 
                  alt='Netlify deployment status'
                />
              </a>
            </div>

            <div className='grid justify-items-start gap-1'>
              <h3 className='font-medium text-lg tracking-tight'>
                Project public repository
              </h3>
              <a 
                href='https://github.com/rendoruiz/kono-list'
                title='Open GitHub link'
                target='_blank'
                rel='noreferrer'
                className='rounded px-5 py-2 bg-black text-white font-medium leading-none hover:opacity-80 active:outline active:outline-blue-600 active:outline-offset-2'
              >
                Star on GitHub
              </a>
            </div>
          </section>

          <section>
            <h2 className='mb-1 font-bold text-2xl tracking-tight'>
              Install as an app
            </h2>
            
            <p>
              Most chromium-based browsers like Google Chrome or Microsoft Edge allow you to install compatible sites as an app or add a website on your mobile home screen for easier access.
            </p>
            <p className='mt-1'>
              When installed, Konolist can be used even with no internet connection.
            </p>
            {isPWAInstallable && (
              <button 
                type='button'
                title='Install app'
                className='rounded mt-4 px-5 py-2 bg-gradient-to-br from-blue-700 to-blue-500 text-white font-medium leading-none hover:opacity-80 active:outline active:outline-blue-600 active:outline-offset-2'
                onClick={handleInstallPWA}
              >
                Install App
              </button>
            )}
          </section>

          <section>
            <h2 className='mb-1 font-bold text-2xl tracking-tight'>
              Reset app
            </h2>
            <p>
              Pressing the button below will perform an operation that will delete all your lists and tasks and reset the app back to its defaults.
            </p>
            <p className='mt-1'>
              Once finished, the page will reload automatically.
            </p>
            <button 
              type='button'
              title='Reset app'
              className='rounded mt-4 px-5 py-2 bg-red-600 text-white font-medium leading-none hover:opacity-80 active:outline active:outline-blue-600 active:outline-offset-2'
              onClick={handleResetCache}
            >
              Reset App
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
 
export default AppSettingsPanel;