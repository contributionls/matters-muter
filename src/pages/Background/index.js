/* eslint-disable no-undef */
import '../../assets/img/icon-48.png';
import '../../assets/img/icon-128.png';
import '../../utils/entry';
import 'whatwg-fetch';
import { openOrFocusOptionsPage } from './util';
import { updateConfigBySubscription } from '../../utils/config';
import { initAnalytics, isFirefox } from '../../utils/common';
browser.browserAction.setPopup({ popup: '' }); //disable browserAction's popup
initAnalytics();
browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    browser.tabs.create({ url: 'options.html' });
  }
});

// Called when the user clicks on the browser action icon.
browser.browserAction.onClicked.addListener(function(tab) {
  openOrFocusOptionsPage();
});

browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // read changeInfo data and do something with it
  // like send the new url to contentscripts.js
  if (changeInfo.url) {
    browser.tabs.sendMessage(tabId, {
      type: 'urlChange',
      url: changeInfo.url,
    });
  }
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'notice') {
    browser.notifications.create(
      'notificationName',
      {
        title: 'Matters消音器',
        type: 'basic',
        iconUrl: 'icon-48.png',
        ...request.data,
      },
      () => {
        sendResponse({ code: 'ok' });
      }
    );
    setTimeout(function() {
      browser.notifications.clear('notificationName', function() {});
    }, 3000);
  }
  if (request.type === 'updateConfig') {
    updateConfigBySubscription()
      .then(() => {
        //success
        sendResponse({ code: 'ok' });
      })
      .catch((e) => {
        sendResponse({ code: 'fail', message: e.message });
      });
  }
  if (request.type === 'analytics') {
    // if chrome then send
    if (!isFirefox()) {
      ga('send', request.data);
    }
    sendResponse({ code: 'ok' });
  }

  return true;
});
browser.alarms.onAlarm.addListener((alarm) => {
  console.log('alarm', alarm);
  if (alarm.name === 'updateConfigSubscriptions') {
    // update config
    updateConfigBySubscription();
  }
});

// crontab auto update config
browser.alarms.create('updateConfigSubscriptions', {
  when: Date.now() + 10000,
  periodInMinutes: 30,
});
