import { hasJsonStructure } from './json';

/**
 *
 * @param property property name.
 * @param storage default value *sessionStorage**.
 */
export const getStoredPropertyValue = (property: string, storage: Storage = sessionStorage) => {
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key) continue;
    const objectValue = storage.getItem(key)!;

    if (hasJsonStructure(objectValue)) {
      const data = JSON.parse(objectValue);
      //console.log(data);
      const propertyValue = data[property];
      console.log(propertyValue);
      if (propertyValue) return propertyValue;
    }
  }
};
