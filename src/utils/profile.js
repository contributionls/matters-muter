// #__next > main > section.jsx-195047847.container > div.jsx-195047847.content-container.l-row > section > section > div > section
import $ from 'jquery';
import debug from './debug';
import { isBelongUsernames } from './common';
import event from './event';
let isMuted;
let config;
let needDestroyed = [];
event.on('unmount', function onUnmount() {
  handleDestroy();
});
export async function initAuthor(pageParams, userStorage, isFirst) {
  debug('init author start', isFirst);
  const author = pageParams.author;
  getData(author, userStorage).then((result) => {
    isMuted = result.isMuted;
    config = result.config;
    if (!config.profileMutedShortcutEnabled) {
      debug('you turn off the profile shortcut');
      return;
    }
    function handler1(e) {
      debug('handle1 event triggerd', e);
      const tippyPopperCommon = `body div.tippy-popper > div.tippy-tooltip > div.tippy-content > div > section > ul`;
      isLoadMoreCompletedBySection(tippyPopperCommon)
        .then(() => {
          debug('detect the dom show');
          // check if need append
          if (
            $(`${tippyPopperCommon} > li:last-child`).hasClass(
              'matters-muter-mute-li'
            )
          ) {
            debug('detect muter item , remove it.');
            // if exist then delete it
            $(`${tippyPopperCommon} > li:last-child`).remove();
          }
          if ($(`${tippyPopperCommon} > li:last-child`)) {
            // <li role="menuitem" class="jsx-2085888330 menu-item"><section tabindex="0" data-clickable="true" class="jsx-761388021 card spacing-y-tight spacing-x-base bg-hover-grey-lighter"><span class="jsx-1133883499 text-icon text-right size-md spacing-base hasIcon"><span class="jsx-1133883499 text">封鎖用戶</span></span></section></li>
            const element = `<li role="menuitem" class="matters-muter-mute-li menu-item"><section tabindex="0" data-clickable="true" data-action="${
              isMuted ? 'cancel' : 'mute'
            }" class="matters-muter-mute-section matters-muter-mute-button jsx-761388021 card spacing-y-tight spacing-x-base bg-hover-grey-lighter"><span class="jsx-1133883499 text-icon text-right size-md spacing-base hasIcon"><span class="text-icon matters-muter-mute-button-span text-right size-sm spacing-tight"><svg viewBox="0 0 24 24" class="icon md" aria-hidden="true"><path d="M17.856 2a.741.741 0 00-1.224-.564L9.04 7.924H4.114a.743.743 0 00-.742.743v6.666c0 .41.332.743.742.743H6.66v-1.485H4.856V9.409h4.458a.74.74 0 00.482-.178l6.576-5.62v1.62h1.484V2zm-1.484 18.389v-9.637h1.484V22a.741.741 0 01-1.224.564L10.8 17.58v-1.952l5.57 4.761zm4.22-14.8a.741.741 0 10-1.018-1.08L3.408 19.756a.742.742 0 001.018 1.08L20.592 5.589z" fill-rule="evenodd"></path></svg><span class="jsx-1133883499 text">${
              isMuted ? '取消静音' : '全站静音'
            }</span></span></section></li>`;
            debug('append element: %o %s', $(`${tippyPopperCommon}`), element);
            setTimeout(() => {
              $(`${tippyPopperCommon}`).append(element);
            }, 20);
          }
        })
        .catch((e) => {
          debug(`can't detect the dom show`);
        });
    }
    function handler2(e) {
      debug('handle2 event triggerd');
      if (e.currentTarget && e.currentTarget.dataset) {
        const data = { ...e.currentTarget.dataset };

        const users = new Set(config.mutedUsers);
        if (data.action === 'mute') {
          users.add(author);
        } else if (data.action === 'cancel') {
          users.delete(author);
        }

        userStorage
          .set({
            ...config,
            mutedUsers: Array.from(users),
          })
          .then(() => {
            debug('save success');
            // success
            setTimeout(() => {
              initAuthor(pageParams, userStorage, false);
            }, 100);
            //
            // notice
            // eslint-disable-next-line no-undef
            browser.runtime.sendMessage(
              {
                type: 'notice',
                data: {
                  message: `${
                    data.action === 'mute'
                      ? '成功添加該用戶為全站靜音用戶'
                      : '已取消对该用户的全站静音'
                  }`,
                },
              },
              function(response) {
                debug('response %o', response);
              }
            );
          })
          .catch((e) => {
            debug('save fail');

            // fail
            // notice
            // eslint-disable-next-line no-undef
            browser.runtime.sendMessage(
              {
                type: 'notice',
                data: {
                  message: `操作失敗請重試`,
                },
              },
              function(response) {
                debug('response %o', response);
              }
            );
          });
      }
    }
    if (isFirst) {
      debug('bind more action button');
      $('body').on('click', "button[aria-label='更多操作']", handler1);
      $('body').on('click', '.matters-muter-mute-button', handler2);
      needDestroyed.push(() => {
        $('body').off('click', "button[aria-label='更多操作']", handler1);
      });
      needDestroyed.push(() => {
        $('body').off('click', '.matters-muter-mute-button', handler2);
      });
    }
  });
}
function handleDestroy() {
  needDestroyed.forEach((func) => {
    func && func();
  });
  needDestroyed = [];
}
``;
async function getData(username, userStorage) {
  const config = await userStorage.get();
  const { mutedUsers } = config;
  return {
    config,
    isMuted: isBelongUsernames(username, mutedUsers),
  };
}
function isLoadMoreCompletedBySection(detector) {
  const retryTimes = 200;
  let sum = 0;
  // body > div.tippy-popper
  return new Promise((resolve, reject) => {
    const checkIsCompleted = function() {
      if (sum > retryTimes) {
        return reject(new Error('check more dialog loading timeout'));
      }
      sum++;
      if ($(detector).length > 0) {
        return resolve();
      } else {
        setTimeout(() => {
          checkIsCompleted();
        }, 10);
      }
    };

    checkIsCompleted();
  });
}
