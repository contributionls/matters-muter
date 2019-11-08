/* eslint-disable no-undef */
export function openOrFocusOptionsPage() {
  const optionsUrl = chrome.extension.getURL('options.html');
  chrome.tabs.query({}, function(extensionTabs) {
    var found = false;
    for (var i = 0; i < extensionTabs.length; i++) {
      if (extensionTabs[i].url.indexOf(optionsUrl) === 0) {
        found = true;
        chrome.tabs.update(extensionTabs[i].id, { selected: true });
      }
    }
    if (found === false) {
      chrome.tabs.create({ url: 'options.html' });
    }
  });
}
