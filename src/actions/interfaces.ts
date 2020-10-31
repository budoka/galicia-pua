import { Moment } from 'moment';
import { Dictionary } from 'src/interfaces';

export interface RunnableState {
  isRunning: boolean;
}

export interface IRequestCache<Data> {
  cache: Dictionary<IRequestDataCache<Data>>;
  lifespan?: number;
}

export interface IRequestDataCache<Data> {
  data: Data;
  expiration?: Moment;
}
