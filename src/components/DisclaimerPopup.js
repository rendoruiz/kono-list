const DisclaimerPopup = ({
  isAgreed,
  setDisclaimerAgreed,
}) => {
  return !isAgreed && (  
    <div className='fixed inset-0 z-50 grid place-items-center overflow-y-auto px-3 py-5 bg-black/60'>
      <div className='grid content-start w-full max-w-lg text-black/90'>
        <header className='grid grid-cols-[1fr,auto] rounded-t p-5 bg-gradient-to-br from-blue-700 to-blue-500 text-white text-center'>
          <div>
            <h2 className='mb-1 font-extrabold text-3xl uppercase'>
              Disclaimer
            </h2>
          </div>
        </header>

        <main className='grid gap-10 content-start rounded-b px-4 pt-5 pb-8 bg-white text-lg'>
          <section className='grid content-start gap-8'>
            <ol className="grid gap-3 list-decimal pl-5">
              <li>
                Konolist does not store any user data on any remote servers and is solely dependent on the user's browser cache or local storage.
              </li>
              <li>
                Konolist's stored data will get deleted anytime the user clears their browser's cache. The option to delete the user's data also exists in the app's settings.
              </li>
              <li className='font-bold text-red-500'>
                The creator of this project will not be held liable for any data loss on this app.
              </li>
            </ol>

            <button 
              type='button'
              className='justify-self-center rounded px-8 py-2 bg-gradient-to-br from-blue-700 to-blue-500 text-white font-medium hover:opacity-80 active:outline active:outline-blue-600 active:outline-offset-2'
              onClick={setDisclaimerAgreed}
            >
              I agree with all of these terms.
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
 
export default DisclaimerPopup;