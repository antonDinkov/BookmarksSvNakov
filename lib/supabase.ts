import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY');
}

type StorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

function createInMemoryStorage(): StorageAdapter {
  const memory = new Map<string, string>();

  return {
    async getItem(key) {
      return memory.get(key) ?? null;
    },
    async setItem(key, value) {
      memory.set(key, value);
    },
    async removeItem(key) {
      memory.delete(key);
    },
  };
}

function createWebStorage(): StorageAdapter {
  return {
    async getItem(key) {
      try {
        return globalThis.localStorage?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    async setItem(key, value) {
      try {
        globalThis.localStorage?.setItem(key, value);
      } catch {
        // Ignore storage failures and continue without persistence.
      }
    },
    async removeItem(key) {
      try {
        globalThis.localStorage?.removeItem(key);
      } catch {
        // Ignore storage failures and continue without persistence.
      }
    },
  };
}

function createNativeStorage(): StorageAdapter {
  const fallback = createInMemoryStorage();

  return {
    async getItem(key) {
      try {
        return await AsyncStorage.getItem(key);
      } catch {
        return fallback.getItem(key);
      }
    },
    async setItem(key, value) {
      try {
        await AsyncStorage.setItem(key, value);
      } catch {
        await fallback.setItem(key, value);
      }
    },
    async removeItem(key) {
      try {
        await AsyncStorage.removeItem(key);
      } catch {
        await fallback.removeItem(key);
      }
    },
  };
}

const storage = Platform.OS === 'web' ? createWebStorage() : createNativeStorage();

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
