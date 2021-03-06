/**
 * Copyright 2022 Rendo Ruiz. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

import cryptoJs from 'crypto-js';

const encryptObject = (object) => {
  return cryptoJs.AES.encrypt(
    JSON.stringify(object), 
    `${process.env.REACT_APP_SECRET_KEY}`
  ).toString();
}

const decryptObject = (cipherText) => {
  if (!cipherText) {
    return null;
  }
  const bytes = cryptoJs.AES.decrypt(cipherText, `${process.env.REACT_APP_SECRET_KEY}`);
  return JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
}

export { encryptObject, decryptObject }