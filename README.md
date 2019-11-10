# Matters Muter

A chrome/firefox extension for muting unfriendly accounts on matters

This project build with [chrome-extension-boilerplate-react](https://github.com/lxieyang/chrome-extension-boilerplate-react)

## Usage

You can see [here](https://matters.news/@deserve/%E4%BD%BF%E7%94%A8%E8%BF%99%E4%B8%AA%E6%B5%8F%E8%A7%88%E5%99%A8%E6%89%A9%E5%B1%95%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AFmatters%E7%9A%84%E5%85%A8%E7%AB%99%E5%B1%8F%E8%94%BD-%E6%8B%89%E9%BB%91-%E9%9D%99%E9%9F%B3%E5%8A%9F%E8%83%BD-zdpuAwGnxxMnyvaBJwCszuRrHjqprMohMPkXXWfYYKwEzvkrX)

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
- [x] add subscrib feature
- [ ] last update time
