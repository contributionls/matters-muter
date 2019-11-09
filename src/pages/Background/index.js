/* eslint-disable no-undef */
import '../../assets/img/icon-48.png';
import '../../assets/img/icon-128.png';
import { openOrFocusOptionsPage } from './util';
chrome.browserAction.setPopup({ popup: '' }); //disable browserAction's popup
// Standard Google Universal Analytics code
(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  // eslint-disable-next-line no-unused-expressions
  (i[r] =
    i[r] ||
    function() {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  // eslint-disable-next-line no-unused-expressions
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(
  window,
  document,
  'script',
  'https://www.google-analytics.com/analytics.js',
  'ga'
); // Note: https protocol here
ga('create', 'UA-144863614-2', 'auto'); // Enter your GA identifier
ga('set', 'checkProtocolTask', function() {}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');

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
  if (request.type === 'analytics') {
    ga('send', request.data);
  }

  return true;
});
