/* eslint-disable no-undef */
import userDefaultConfig from './user-config-default';
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
      chrome.storage.local.get(this.defaultSettings, (local) => {
        if (!local.syncSettings) {
          resolve(local);
          return;
        }
        chrome.storage.sync.get(this.defaultSettings, ($sync) => {
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
          chrome.storage.local.set({ syncSettings: true }, () => {
            chrome.storage.sync.set(settings, () => {
              if (chrome.runtime.lastError) {
                console.warn(
                  'Settings synchronization was disabled due to error:',
                  chrome.runtime.lastError
                );
                const local = Object.assign(Object.assign({}, settings), {
                  syncSettings: false,
                });
                chrome.storage.local.set(local, () => resolve(local));
              } else {
                resolve(settings);
              }
            });
          });
        } else {
          chrome.storage.local.set(settings, () => resolve(settings));
        }
      }, SAVE_TIMEOUT);
    });
  }
  async set($settings) {
    if (!this.isInit) {
      await this.loadSettings();
    }
    this.settings = Object.assign(Object.assign({}, this.settings), $settings);
    await this.saveSettings();
  }
}
