/* eslint-disable no-undef */
import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import { openOrFocusOptionsPage } from './util';
chrome.browserAction.setPopup({ popup: '' }); //disable browserAction's popup

console.log('This is the background page.');
console.log('Put the background scripts here.');

// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {
  openOrFocusOptionsPage();
});
