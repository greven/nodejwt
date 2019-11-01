import Keyv from 'keyv'

import config from '../config'

const uri = config.get('keystore:uri')

interface KeyValueMap<K, V> {
  get(key: K): V | Promise<V>
  set(key: K, value: V): boolean | Promise<boolean> | void
  delete(key: K): boolean | Promise<boolean>
}

export class KeyStore implements KeyValueMap<string, string> {
  store: Keyv<any>

  constructor(options?: object) {
    this.store = new Keyv(uri, options).on('error', err =>
      console.log('Keyv Connection Error', err)
    )
  }

  get(key: string) {
    return this.store.get(key)
  }

  set(key: string, value: string, ttl?: number) {
    return this.store.set(key, value, ttl)
  }

  delete(key: string) {
    return this.store.delete(key)
  }
}
