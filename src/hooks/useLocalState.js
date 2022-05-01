/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import * as React from 'react';

import { decryptObject, encryptObject } from '../utils/cryptoJs';

const isNullOrUndefined = (value) => {
  return (value === null || value === undefined) ? true : false;
}

const useLocalState = (key, initialState) => {
  const storedObject = JSON.parse(localStorage.getItem(key));
  const [value, setValue] = React.useState(
    // decryptObject(localStorage.getItem(key)) !== null ? decryptObject(localStorage.getItem(key)) : initialState
    isNullOrUndefined(storedObject) ? storedObject : initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
 
export default useLocalState;