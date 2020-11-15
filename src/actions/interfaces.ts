export interface RunnableState {
  isRunning: boolean;
}

export interface CacheableState {
  cache: { key: string; expiration?: number };
}
