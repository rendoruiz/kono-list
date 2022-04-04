import cryptoJs from 'crypto-js';

const encryptObject = (object) => {
  return cryptoJs.AES.encrypt(
    JSON.stringify(object), 
    `${process.env.REACT_APP_SECRET_KEY}`
  ).toString();
}

const decryptObject = (cipherText) => {
  const bytes = cryptoJs.AES.decrypt(cipherText, `${process.env.REACT_APP_SECRET_KEY}`);
  return JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
}

export { encryptObject, decryptObject }