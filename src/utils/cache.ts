import moment from 'moment';

export interface CacheData<T> {
  value: T;
  expiration?: number;
  hits: number;
}

export interface CacheStorage<T> {
  [key: string]: CacheData<T>;
}

export class Cache<T> {
  id: string;
  storage: Map<string, CacheData<T>>;

  constructor(id: string) {
    this.id = id;
    this.storage = new Map();
  }

  get = (key: string) => {
    const data = this.storage.get(key);
    if (!data) {
      console.log(`[${this.id}|${key}] doesn't exist.`);
      return;
    }
    console.log(`[${this.id}|${key}] Value: '${data.value}', Expiration: ${data.expiration}.`);
    return data.value;
  };

  save = (key: string, value: T, expiration?: number) => {
    const data = this.storage.get(key);
    if (data) {
      const { value, expiration, hits } = data;
      console.log(`[${this.id}|${key}] is already cached. Value: '${value}', Expiration: ${expiration}.`);
      const newValue = { value, expiration, hits: hits + 1 };
      this.storage.set(key, newValue);
    }

    // Check if cached data is expired
    if ((data && expiration && expiration >= moment().unix()) || !data) {
      const hits = 0;
      const newValue = { value, expiration, hits };
      this.storage.set(key, newValue);
      console.log(`[${this.id}|${key}] has been cached. Value: '${value}', Expiration: ${expiration}.`);
    }
  };

  remove = (key: string) => {
    this.storage.delete(key);
    console.log(`[${this.id}|${key}] has been removed.`);
  };

  clear = () => {
    this.storage.clear();
    console.log(`[${this.id}] has been clear.`);
  };
}
