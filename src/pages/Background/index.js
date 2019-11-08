/* eslint-disable no-undef */
import '../../assets/img/icon-48.png';
import '../../assets/img/icon-128.png';
import { openOrFocusOptionsPage } from './util';
chrome.browserAction.setPopup({ popup: '' }); //disable browserAction's popup

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.tabs.create({ url: 'options.html' });
  }
});

// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {
  openOrFocusOptionsPage();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // read changeInfo data and do something with it
  // like send the new url to contentscripts.js
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      type: 'urlChange',
      url: changeInfo.url,
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'notice') {
    chrome.notifications.create(
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
      chrome.notifications.clear('notificationName', function() {});
    }, 3000);
  }

  return true;
});
