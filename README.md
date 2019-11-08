# Matters Muter

A chrome extension for muting unfriendly accounts on matters

This project build with [chrome-extension-boilerplate-react](https://github.com/lxieyang/chrome-extension-boilerplate-react)

## How to develop

1. Run `yarn` to install the dependencies.
1. Run `yarn start`
1. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   1. Check `Developer mode`
   1. Click on `Load unpacked extension`
   1. Select the `build` folder.
1. Happy hacking.

## how to debug

The project use [debug](https://github.com/visionmedia/debug) library for debuging. So you can modify the matters.news's localstorage's specific key `debug`, change it to `matters-muter:*`, then the debug log will show in the devtools.

## TODO

- [x] shortcut add to muted
- [x] muted by votes
- [x] refresh without reload
- [x] shortcut config add
