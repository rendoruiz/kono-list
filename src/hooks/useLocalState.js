import * as React from 'react';

import { decryptObject, encryptObject } from '../utils/cryptoJs';

const useLocalState = (key, initialState) => {
  const [value, setValue] = React.useState(
    decryptObject(localStorage.getItem(key)) !== null ? decryptObject(localStorage.getItem(key)) : initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, encryptObject(value));
  }, [key, value]);

  return [value, setValue];
}
 
export default useLocalState;