// #__next > main > section.jsx-195047847.container > div.jsx-195047847.content-container.l-row > section > section > div > section
import $ from 'jquery';
import debug from './debug';
import { isBelongUsernames } from './common';
import event from './event';

let GLOBAL_TRIGGER_FLAG = false;
export async function initAuthor(pageParams, userStorage) {
  debug('init author start');
  const author = pageParams.author;
  let destroyFuncArr = [];
  getData(author, userStorage).then((result) => {
    const { isMuted, config } = result;
    if (!config.profileMutedShortcutEnabled) {
      debug('you turn off the profile shortcut');
      return;
    }
    function handler1(e) {
      if (GLOBAL_TRIGGER_FLAG) {
        GLOBAL_TRIGGER_FLAG = false;
        return;
      }
      debug('handle1 event triggerd');

      isLoadMoreCompletedBySection()
        .then(() => {
          debug('detect the dom show');
          // check if need append

          if (
            $(
              'body > div.tippy-popper > div.tippy-tooltip > div > div > ul > li:last-child'
            ).hasClass('matters-muter-mute-li')
          ) {
            // if exist then delete it
            $(
              'body > div.tippy-popper > div.tippy-tooltip > div > div > ul > li:last-child'
            ).remove();
          }
          if (
            $(
              'body > div.tippy-popper > div.tippy-tooltip > div > div > ul > li:last-child'
            )
          ) {
            const $parent = $(
              'body > div.tippy-popper > div.tippy-tooltip > div > div > ul'
            );
            const element = `<li role="menuitem" class="matters-muter-mute-li item spacing-vertical-xtight spacing-horizontal-default bg-hover-grey"><button type="button" data-action="${
              isMuted ? 'cancel' : 'mute'
            }" class="matters-muter-mute-button"><span class="text-icon matters-muter-mute-button-span text-right size-sm spacing-tight"><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width: 1rem;height: 1rem;" class=" small"><use xlink:href="#block--sprite" class=""></use></svg><span class=" matters-muter-mute-button-text text">${
              isMuted ? '取消静音' : '全站静音'
            }</span></span></button></li>`;
            debug('append element: %s', element);
            $parent.append(element);
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
        // click more button for closing the tooltips
        GLOBAL_TRIGGER_FLAG = true;

        const isDownHide = $('span.u-sm-down-hide').css('display') !== 'none';
        const isUpHide = $('span.u-sm-up-hide').css('display') !== 'none';
        // different media size has different element
        if (isDownHide) {
          $($('span.u-sm-down-hide')[1])
            .find('> button:nth-child(1)')
            .trigger('click');
        }

        if (isUpHide) {
          $($('span.u-sm-up-hide')[0])
            .find('> button:nth-child(1)')
            .trigger('click');
        }
        // $(
        //   '#__next > main > section.container > div.content-container.l-row > section > section > section > header > section.buttons > span.u-sm-down-hide > button:nth-child(1)'
        // ).trigger('click');

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
            // refresh
            handleDestroy();
            setTimeout(() => {
              initAuthor(pageParams, userStorage);
            }, 10);
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
    event.on('unmount', function onUnmount() {
      handleDestroy();
      event.off('unmount', onUnmount);
    });
    // first destroy
    // handleDestroy();
    $('body').on('click', "button[aria-label='更多操作']", handler1);
    $('body').on('click', '.matters-muter-mute-button', handler2);
    destroyFuncArr.push(() => {
      $('body').off('click', "button[aria-label='更多操作']", handler1);
    });
    destroyFuncArr.push(() => {
      $('body').off('click', '.matters-muter-mute-button', handler2);
    });
    function handleDestroy() {
      destroyFuncArr.forEach((func) => {
        func && func();
      });
      destroyFuncArr = [];
    }
  });
}
async function getData(username, userStorage) {
  const config = await userStorage.get();
  const { mutedUsers } = config;
  return {
    config,
    isMuted: isBelongUsernames(username, mutedUsers),
  };
}
function isLoadMoreCompletedBySection() {
  const retryTimes = 200;
  let sum = 0;
  // body > div.tippy-popper
  return new Promise((resolve, reject) => {
    const checkIsCompleted = function() {
      if (sum > retryTimes) {
        return reject(new Error('check more dialog loading timeout'));
      }
      sum++;
      if (
        $(`body > div.tippy-popper > div.tippy-tooltip > div > div > ul`)
          .length > 0
      ) {
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
