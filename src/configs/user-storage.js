/* eslint-disable no-undef */
import userDefaultConfig, { userConfigSchema } from './user-config-default';
import Ajv from 'ajv';
const SAVE_TIMEOUT = 1000;

export default class UserStorage {
  constructor() {
    this.timeout = null;
    this.defaultSettings = userDefaultConfig;
    this.settings = null;
    this.isInit = false;
  }
  async get() {
    if (this.isInit) {
      return this.settings;
    } else {
      return await this.loadSettings();
    }
  }
  async loadSettings() {
    this.settings = await this.loadSettingsFromStorage();
    this.isInit = true;
    return this.settings;
  }
  loadSettingsFromStorage() {
    return new Promise((resolve) => {
      browser.storage.local.get(this.defaultSettings, (local) => {
        if (!local.syncSettings) {
          resolve(local);
          return;
        }
        browser.storage.sync.get(this.defaultSettings, ($sync) => {
          resolve($sync);
        });
      });
    });
  }
  getPrivate(key) {
    return new Promise((resolve) => {
      browser.storage.local.get(key, (local) => {
        if (!local.syncSettings) {
          resolve(local);
          return;
        }
        browser.storage.sync.get(key, ($sync) => {
          resolve($sync);
        });
      });
    });
  }
  async saveSettings() {
    const saved = await this.saveSettingsIntoStorage(this.settings);
    this.settings = saved;
  }
  saveSettingsIntoStorage(settings) {
    if (this.timeout) {
      clearInterval(this.timeout);
    }
    return new Promise((resolve) => {
      this.timeout = setTimeout(() => {
        this.timeout = null;
        if (settings.syncSettings) {
          browser.storage.local.set({ syncSettings: true }, () => {
            browser.storage.sync.set(settings, () => {
              if (browser.runtime.lastError) {
                console.warn(
                  'Settings synchronization was disabled due to error:',
                  browser.runtime.lastError
                );
                const local = Object.assign(Object.assign({}, settings), {
                  syncSettings: false,
                });
                browser.storage.local.set(local, () => resolve(local));
              } else {
                resolve(settings);
              }
            });
          });
        } else {
          browser.storage.local.set(settings, () => resolve(settings));
        }
      }, SAVE_TIMEOUT);
    });
  }
  async set($settings) {
    if (!this.isInit) {
      await this.loadSettings();
    }
    // check schema
    if (isValidConfig($settings)) {
      const newSettings = Object.assign(
        Object.assign({}, this.settings),
        $settings
      );
      if (isValidConfig(newSettings)) {
        this.settings = newSettings;
        await this.saveSettings();
      } else {
        throw new Error('config invalid (2)');
      }
    } else {
      throw new Error('config invalid');
    }
  }
  async setPrivate($settings) {
    await this.saveSettingsIntoStorage($settings);
  }
}

export function isValidConfig(config) {
  var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
  var validate = ajv.compile(userConfigSchema);
  var valid = validate(config);
  return valid;
}
