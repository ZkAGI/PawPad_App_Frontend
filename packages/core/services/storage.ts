/**
 * Storage abstraction for PawPad
 * Mobile uses react-native-keychain, Web uses IndexedDB/localStorage
 */

export interface ISecureStorage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

let _storage: ISecureStorage | null = null;

export const setStorageProvider = (provider: ISecureStorage) => {
  _storage = provider;
};

export const getStorage = (): ISecureStorage => {
  if (!_storage) {
    throw new Error(
      'Storage provider not initialized. Call setStorageProvider() on app start.'
    );
  }
  return _storage;
};
