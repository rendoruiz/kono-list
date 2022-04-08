/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

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