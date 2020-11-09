import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('en');
dayjs.extend(duration);
dayjs.extend(relativeTime);

type Key = string | number;

export interface CacheData<T> {
  value: T;
  expiration?: number;
  hits: number;
}

export interface CacheStorage<T> {
  [key: string]: CacheData<T>;
}

export class CacheMemory<T> {
  id: string;
  private storage: Map<Key, CacheData<T>>;

  constructor(id: string) {
    this.id = id;
    this.storage = new Map();
  }

  get = (key: Key) => {
    if (this.isKeyInvalidOrExpired(key)) return;

    const data = this.storage.get(key)!;

    const expireIn = data.expiration ? dayjs.duration(dayjs.unix(data.expiration).diff(dayjs.unix(dayjs().unix()))).humanize() : null;
    console.log(`[${this.id}|${key}] Value: '${data.value}'${expireIn ? ', Expirate in ' + expireIn : ''}.`);
    return data.value;
  };

  save = (key: Key, value: T, expiration?: number) => {
    const data = this.storage.get(key);
    if (this.isKeyInvalidOrExpired(key)) {
      const hits = 0;
      const newValue = { value, expiration, hits };

      this.storage.set(key, { ...newValue });
      console.log(`[${this.id}|${key}] has been saved in cache. Value: '${value}'${expiration ? ', Expiration: ' + expiration : ''}.`);
    } else {
      const { value, expiration, hits } = data!;
      console.log(`[${this.id}|${key}] is already in cache. Value: '${value}'${expiration ? ', Expiration: ' + expiration : ''}.`);

      const newValue = { value, expiration, hits: hits + 1 };
      this.storage.set(key, newValue);
    }
  };

  isKeyInvalidOrExpired = (key: Key) => {
    const data = this.storage.get(key);

    if (!data) {
      console.log(`[${this.id}|${key}] doesn't exist.`);
      return true;
    }

    const expiration = data.expiration;
    const now = dayjs().unix();

    if (expiration && now > expiration) {
      const expiredAgo = dayjs.duration(dayjs.unix(expiration).diff(dayjs.unix(now))).humanize();
      console.log(`[${this.id}|${key}] is expired. Expired ago ${expiredAgo}.`);
      return true;
    }

    return false;
  };

  remove = (key: Key) => {
    this.storage.delete(key);
    console.log(`[${this.id}|${key}] has been removed.`);
  };

  clear = () => {
    this.storage.clear();
    console.log(`[${this.id}] has been clear.`);
  };
}
