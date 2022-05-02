import { decryptObject, encryptObject } from "./cryptoJs"

const listKey = 'list';
const taskKey = 'task';

const encryptor = (key, object) => {
  return localStorage.setItem(
    key,
    encryptObject(object),
  );
}

const decryptor = (key) => {
  return decryptObject(
    localStorage.getItem(key)
  );
}

const setEncryptedList = (object) => encryptor(listKey, object);
const getDecryptedList = () => decryptor(listKey);

const setEncryptedTask = (object) => encryptor(taskKey, object);
const getDecryptedTask = () => decryptor(taskKey);

export { setEncryptedList, getDecryptedList, setEncryptedTask, getDecryptedTask }