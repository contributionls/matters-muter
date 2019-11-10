/* eslint-disable no-undef */
export function openOrFocusOptionsPage() {
  const optionsUrl = browser.extension.getURL('options.html');
  browser.tabs.query({}, function(extensionTabs) {
    var found = false;
    for (var i = 0; i < extensionTabs.length; i++) {
      if (extensionTabs[i].url.indexOf(optionsUrl) === 0) {
        found = true;
        browser.tabs.update(extensionTabs[i].id, { active: true });
      }
    }
    if (found === false) {
      browser.tabs.create({ url: 'options.html' });
    }
  });
}
