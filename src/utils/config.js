/* eslint-disable no-undef */
import UserStorage from '../configs/user-storage';
import mergeDeep from 'deepmerge';
import isPlainObj from 'is-plain-obj';
import equal from 'deep-equal';
import { isFirefox } from './common';

export async function updateConfigBySubscription() {
  //
  const userStorage = new UserStorage();
  const currentConfig = await userStorage.get();
  const { subscriptions } = currentConfig;
  if (
    subscriptions &&
    Array.isArray(subscriptions) &&
    subscriptions.length > 0
  ) {
    for (let i = 0; i < subscriptions.length; i++) {
      const sub = subscriptions[i];
      // auto merge
      try {
        let response = await fetch(sub);
        let json = await response.json();
        const finalConfig = mergeConfig(json, currentConfig);
        await userStorage.set(finalConfig);
        const isChanged = !equal(finalConfig, currentConfig);
        // check is updated
        // record and
        // success
        userStorage.setPrivate({
          latestUpdate: {
            status: 'success',
            time: Date.now(),
            isChanged,
          },
        });
        if (isChanged) {
          console.log('Update the config success', new Date());
        }
        // report
        // report
        if (!isFirefox()) {
          ga('send', {
            hitType: 'event',
            eventCategory: 'subscription-update',
            eventAction: 'success',
            eventLabel: isChanged ? 'changed' : 'notChanged',
          });
        }
      } catch (error) {
        console.error('Update config failed', error);
        // fail
        userStorage.setPrivate({
          latestUpdate: {
            status: 'fail',
            time: Date.now(),
            message: error.message,
          },
        });
        // report
        if (!isFirefox()) {
          ga('send', {
            hitType: 'exception',
            exDescription: error.message,
            exFatal: false,
          });
        }
        throw error;
      }
    }
  }
}

export function mergeConfig(newConfig, currentConfig) {
  if (newConfig && isPlainObj(newConfig)) {
    // handle
    // no merge some field
    delete newConfig.version;
    delete newConfig.enabled;
    delete newConfig.subscriptions;

    const merged = mergeDeep(currentConfig, newConfig);
    // unique arr
    merged.mutedUsers = Array.from(new Set(merged.mutedUsers));
    merged.mutedKeywords = Array.from(new Set(merged.mutedKeywords));

    return merged;
  } else {
    return currentConfig;
  }
}
