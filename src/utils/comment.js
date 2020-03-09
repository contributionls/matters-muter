/* eslint-disable no-undef */
import debug from './debug';
import $ from 'jquery';
import log from './log';
import { isBelongUsernames, isBelongKeywords } from './common';
import md5 from 'js-md5';
import event from './event';
const GLOBAL_COMMENTS_MAP = {};
let GLOBAL_IS_CLOSE_UNLOGIN_OUTER = false;
let GLOBAL_IS_DETECTING_OUTER = false;
let needDestroyed = [];
event.on('unmount', function onUnmount() {
  needDestroyed.forEach((func) => {
    func && func();
  });
  //delete
  needDestroyed = [];
});

export function initFilterComment(opts) {
  opts = {
    mutedUsers: [],
    ...opts,
  };
  debug('detail init');

  // when init, handle the document, first should detect is dom is loaded.
  detectFilterComment('all', opts);
  // listen comments load-mmore button, when the load-more button clicked handle the document(for hidden the later elements)

  addClickListenerBySection('#featured-comments', opts);
  addClickListenerBySection('#latest-responses', opts);
}

export function initHandleNoLoginOuter(opts) {
  debug('init no login outer handler');
  if (!GLOBAL_IS_CLOSE_UNLOGIN_OUTER && !GLOBAL_IS_DETECTING_OUTER) {
    debug('listen scroll event');
    $(window).scroll(function() {
      if (
        $(window).scrollTop() + $(window).height() >
        $(document).height() - 300
      ) {
        detectOuter(opts);
      }
    });
  }

  detectOuter(opts);
}
function detectOuter(opts) {
  if (!GLOBAL_IS_CLOSE_UNLOGIN_OUTER && !GLOBAL_IS_DETECTING_OUTER) {
    debug('start detect outer');
    GLOBAL_IS_DETECTING_OUTER = true;
    isLoadNoLoginOuterCompleted()
      .then(() => {
        GLOBAL_IS_DETECTING_OUTER = false;
        // click
        const closeButtonSelector = `div.close > button`;
        GLOBAL_IS_CLOSE_UNLOGIN_OUTER = true;
        $(closeButtonSelector).click();
        // if found
      })
      .catch((e) => {
        debug('cannot found outer');
        GLOBAL_IS_DETECTING_OUTER = false;
      });
  }
}
function addClickListenerBySection(section, opts) {
  //   // #featured-comments > section > section:nth-child(5) > section > ul > button
  const viewAllButtonSelector = `${section} > section > section >section > ul > button`;

  $('body').on('click', viewAllButtonSelector, onViewMoreButtonClicked);
  needDestroyed.push(() => {
    $('body').off('click', viewAllButtonSelector, onViewMoreButtonClicked);
  });

  // listen page comments load-mmore button,when the load-more button clicked handle the document(for hidden the later elements)
  function onViewMoreButtonClicked(e) {
    debug('view more button clicked');
    // loop check if load completed
    delayFilterComment(opts);
    section, opts;
  }

  // listen show-hidden-button, when the button clicked, replace the origin html
  function onBodyClicked(e) {
    if (e.target && e.target.className === 'matter-muter-comment-placeholder') {
      if (
        e.target.dataset &&
        e.target.dataset.id &&
        e.target.dataset.selector
      ) {
        const id = e.target.dataset.id;
        const selector = e.target.dataset.selector;

        const html = GLOBAL_COMMENTS_MAP[id];

        if (html) {
          const $selector = $(selector);
          $selector.html(html);
          // flag done
          $selector.addClass('matters-muter-comment-skip');
        }
      }
    }
    if (e.target && e.target.className === 'matter-muter-why') {
      // eslint-disable-next-line no-undef
      window.open(browser.extension.getURL('options.html'));
    }
  }
  $('body').on('click', onBodyClicked);
  needDestroyed.push(() => {
    $('body').off('click', onBodyClicked);
  });
}
function detectFilterComment(section, opts) {
  if (section === 'all') {
    isLoadCommentsCompletedBySection('#latest-responses', 'init')
      .then(() => {
        debug('load comments completed');
        filterComments(opts);
      })
      .catch((e) => {
        debug('check loading comments fail %o', e);
        // even fail, retry replace
        // filterComments(opts);
      });
    isLoadCommentsCompletedBySection('#featured-comments', 'init')
      .then(() => {
        debug('load comments completed');
        filterComments(opts);
      })
      .catch((e) => {
        debug('check loading comments fail %o', e);
      });
  } else {
    isLoadCommentsCompletedBySection(section)
      .then(() => {
        debug('load comments completed');
        filterComments(opts);
      })
      .catch(() => {
        debug('check loading comments fail');
        // even fail, retry replace
        filterComments(opts);
      });
  }
}
function delayFilterComment(opts) {
  setTimeout(() => {
    filterComments(opts);
  }, opts.timeout || 10);
}
// affective function
export function filterComments(opts) {
  // start
  debug('start filterComments');
  debug('options: %o', opts);

  // get all selectors that need to mute
  try {
    const mutedComments = getNeedMutedComments(opts);
    debug('all selectors that need to mute', mutedComments);
    // replace with the specific html
    mutedComments.forEach((mutedComment) => {
      // write to global cache, for toggle show using
      // check if it's raw html, only cache the real raw html
      const $content = mutedComment.contentElement;
      if ($content.length > 0) {
        const contentHtmlRaw = $content.html();
        const contentId = md5(contentHtmlRaw);
        GLOBAL_COMMENTS_MAP[contentId] = contentHtmlRaw;
        $content.html(
          getCommentReplacedHtml({
            id: contentId,
            ...mutedComment,
          })
        );
      }
    });
    debug('GLOBAL_COMMENTS_MAP', GLOBAL_COMMENTS_MAP);
  } catch (err) {
    browser.runtime.sendMessage(
      {
        type: 'analytics',
        data: {
          hitType: 'exception',
          exDescription: err.message,
          exFatal: false,
        },
      },
      function(response) {
        debug('response %o', response);
      }
    );
  }
}
export function getCommentReplacedHtml(opts) {
  return `<p class="matter-muter-comment-placeholder" data-selector="${opts.contentSelector}" data-id="${opts.id}" style="padding-top:0.2rem;cursor: pointer;color:#b3b3b3;">${opts.reason}，點擊可查看原評論內容（<span style="font-style:italic;" class="matter-muter-why">為什麼？</span>）</p>`;
}

export function getNeedMutedComments(opts) {
  const allLatestComments = getAllCommentsSelectorsBySection(
    '#latest-responses'
  );
  const allFeatureComments = getAllCommentsSelectorsBySection(
    '#featured-comments'
  );
  const allComments = allFeatureComments.concat(allLatestComments);
  let matchedUsernameComments = [];
  let matchedKeywordComments = [];
  let matchedDownVoteComments = [];
  if (opts.mutedByUsernameEnabled) {
    matchedUsernameComments = allComments
      .filter((item) => {
        return (
          !item.muted &&
          !item.skip &&
          isBelongUsernames(item.username, opts.mutedUsers)
        );
      })
      .map((item) => {
        item.reason = '該評論作者被設置為靜音用戶，已折疊該評論';
        item.mutedHandleFlag = true;
        // analytics
        browser.runtime.sendMessage(
          {
            type: 'analytics',
            data: {
              hitType: 'event',
              eventCategory: 'mute-comment',
              eventAction: 'username',
              eventLabel: item.username,
            },
          },
          function(response) {
            debug('response %o', response);
          }
        );
        return item;
      });
  }
  if (opts.mutedByKeywordEnabled) {
    matchedKeywordComments = allComments
      .filter((item) => {
        item.matchedKeyword = isBelongKeywords(
          item.content,
          opts.mutedKeywords
        );
        return (
          !item.mutedHandleFlag &&
          !item.muted &&
          !item.skip &&
          item.matchedKeyword
        );
      })
      .map((item) => {
        item.reason = '該評論匹配到關鍵詞靜音設置，已折疊該評論';
        item.mutedHandleFlag = true;
        // analytics
        browser.runtime.sendMessage(
          {
            type: 'analytics',
            data: {
              hitType: 'event',
              eventCategory: 'mute-comment',
              eventAction: 'keyword',
              eventLabel: item.matchedKeyword,
            },
          },
          function(response) {
            debug('response %o', response);
          }
        );
        return item;
      });
  }
  if (opts.mutedByDownVoteEnabled) {
    matchedDownVoteComments = allComments
      .filter((item) => {
        return (
          !item.mutedHandleFlag &&
          !item.muted &&
          !item.skip &&
          item.downVote >= opts.downVote
        );
      })
      .map((item) => {
        item.reason = `該評論被踩的數量多於${opts.downVote}個，已被折疊`;
        item.mutedHandleFlag = true;
        // analytics
        browser.runtime.sendMessage(
          {
            type: 'analytics',
            data: {
              hitType: 'event',
              eventCategory: 'mute-comment',
              eventAction: 'downVote',
              eventLabel: opts.downVote,
            },
          },
          function(response) {
            debug('response %o', response);
          }
        );
        return item;
      });
  }
  return matchedUsernameComments
    .concat(matchedKeywordComments)
    .concat(matchedDownVoteComments)
    .map((item) => {
      delete item.mutedHandleFlag;
      delete item.matchedKeyword;
      return item;
    });
}
export function getAllCommentsSelectorsBySection(section) {
  let matchedSelectors = [];
  // find the muted users comments' elements from latest comments
  // #latest-responses > section
  const latestMainCommentsSelector = `${section} > section > section`;
  const $latestMainComments = $(latestMainCommentsSelector);
  debug(
    '$latestMainComments: %s ,%o',
    latestMainCommentsSelector,
    $latestMainComments
  );
  if ($latestMainComments && $latestMainComments.length > 0) {
    $latestMainComments.each((rootIndex, commentsElement) => {
      debug('comment,%s,start', rootIndex);
      const $commentsElement = $(commentsElement);
      // check comment type
      let contentType = '';
      // #Q29tbWVudDoxMTA5MDI > section > section > p
      let contentSelector = `${latestMainCommentsSelector}:nth-child(${rootIndex +
        1}) > section > article > section`;

      let sectionContainerSelector = `${latestMainCommentsSelector}:nth-child(${rootIndex +
        1}) > section > section`;
      const $sectionContainer = $(sectionContainerSelector);
      debug(
        'sectionContainerSelector %s %o',
        sectionContainerSelector,
        $sectionContainer
      );
      const $content = $(contentSelector);
      if ($content.length > 0 && $content.hasClass('content-container')) {
        // comment type
        contentType = 'comment';
      } else if (
        $sectionContainer.length > 0 &&
        $sectionContainer.hasClass('article-digest')
      ) {
        //
        contentType = 'digest';
      }
      debug('contentType', contentType);

      if (contentType === 'comment') {
        // cal selector
        // #featured-comments > section > section:nth-child(6) > section
        let selector = `${latestMainCommentsSelector}:nth-child(${rootIndex +
          1}) > section`;
        const commentData = getDataByCommentElement(
          $commentsElement.find('> section')
        );
        debug('commentData: %o', commentData);
        commentData.selector = selector;
        matchedSelectors.push(commentData);
        // check if sencond comment is exist
        // #latest-responses > section > section:nth-child(13) > section > ul > li
        const descendantCommentsSelector = `${selector} > ul > li`;
        const $descendantComments = $(descendantCommentsSelector);
        debug(
          'descendantCommentsSelector: %s %o',
          descendantCommentsSelector,
          $descendantComments
        );
        // #featured-comments > ul > li:nth-child(2) > section > div > ul > li > section > div > div > p
        if ($descendantComments.length > 0) {
          // exist descendant comments
          $descendantComments.each((descendantIndex, descendantElement) => {
            const descendantCommentData = getDataByCommentElement(
              $(descendantElement)
            );
            const descendantCommentSelector =
              selector + `> ul > li:nth-child(${descendantIndex + 1})`;
            descendantCommentData.selector = descendantCommentSelector;
            matchedSelectors.push(descendantCommentData);
          });
        }
      }

      debug('comment,%s,end', rootIndex);
    });
  } else {
    debug('Can not find the comments element, the extension can not work');
  }
  // string handle
  matchedSelectors = matchedSelectors.map((item) => {
    item.contentSelector = item.selector + ` > article > section > section`;
    return item;
  });
  // find the muted users comments' elements from featured comments
  return matchedSelectors;
}
function getDataByCommentElement($commentsElement) {
  // #featured-comments > ul > li:nth-child(3) > section > header > div > section > section > a > span > span.jsx-2608422601.username
  // #featured-comments > section > section:nth-child(6) > section > article > header > a > section > span > span.jsx-4074194958.username
  const $username = $commentsElement.find(
    '> article > header > a > section.container > span.name > span.username'
  );
  debug('$username: %o', $username);
  if ($username && $username.length > 0) {
    const username = $username.text().trim();
    const $comment = $(
      $username
        .parent()
        .parent()
        .parent()
        .parent()
        .parent()
    );
    const commentElementId = $comment.attr('id');
    const $content = $comment.find('> section > section');
    const content = $content.text();
    // #Q29tbWVudDoxMTIzMzk > header > a > section > span > span.jsx-4074194958.displayname
    const $name = $comment.find(
      '> header > a > section > span > span.displayname'
    );

    const name = $name.text().trim();
    // #Q29tbWVudDo3NTgwNw > div > footer > div > button:nth-child(1) > span > span
    // #featured-comments > section > section:nth-child(2) > section > article > section > footer > section > button:nth-child(2) > div > span > span
    // #Q29tbWVudDoxMDcxMjc > section > footer
    const $footer = $comment.find(`> section > footer`);
    const footerAiraLabel = $footer.attr('aira-label');
    const footerAiraLabelMatchResult = footerAiraLabel.match(/^(\d+).+(\d+).+/);
    let upVote = 0;
    let downVote = 0;
    if (
      footerAiraLabelMatchResult &&
      footerAiraLabelMatchResult[1] &&
      footerAiraLabelMatchResult[2]
    ) {
      upVote = Number(footerAiraLabelMatchResult[1]);
      downVote = Number(footerAiraLabelMatchResult[2]);
    }

    let muted = false;
    const $muterPlaceHolder = $content.find(
      '> p.matter-muter-comment-placeholder'
    );
    if ($muterPlaceHolder.length > 0) {
      muted = true;
    }
    // if blocked by matters official
    const isBlockedByOffcialSetting =
      $content.find('> p.inactive-content').length > 0;
    const commentItem = {
      username: username,
      name,
      upVote,
      downVote,
      element: $comment,
      contentElement: $content,
      content,
      muted,
      isBlockedByOffcialSetting,
      skip:
        isBlockedByOffcialSetting ||
        $content.hasClass('matters-muter-comment-skip'),
    };
    return commentItem;
  } else {
    return {};
  }
}

function isLoadCommentsCompletedBySection(section, stage) {
  const retryTimes = 400;
  let sum = 0;
  const latestCommentSelector = `${section} > section > section`;
  const $startLatestComments = $(latestCommentSelector);
  debug(
    'latestCommentSelector %s %o',
    latestCommentSelector,
    $startLatestComments
  );
  return new Promise((resolve, reject) => {
    const checkIsCompleted = function() {
      if (sum > retryTimes) {
        return reject(new Error('check comments loading timeout'));
      }
      sum++;
      const $currentLatestComments = $(latestCommentSelector);
      if (stage === 'init') {
        if ($currentLatestComments.length > 0) {
          return resolve();
        } else {
          setTimeout(() => {
            checkIsCompleted();
          }, 30);
        }
      } else {
        if ($currentLatestComments.length > $startLatestComments.length) {
          return resolve();
        } else {
          setTimeout(() => {
            checkIsCompleted();
          }, 30);
        }
      }
    };
    checkIsCompleted();
  });
}

function isLoadNoLoginOuterCompleted() {
  const retryTimes = 200;
  let sum = 0;
  // $('div.close > button').click()
  const closeButtonSelector = `div.close > button`;
  const signupButtonSelector = `div.signup`;

  return new Promise((resolve, reject) => {
    const checkIsCompleted = function() {
      if (sum > retryTimes) {
        return reject(
          new Error('check isLoadNoLoginOuterCompleted loading timeout')
        );
      }
      sum++;
      const $closeButton = $(closeButtonSelector);
      const $signupButton = $(signupButtonSelector);

      // debug('closeButton %s %o', closeButtonSelector, $closeButton);

      if ($closeButton.length > 0 && $signupButton.length > 0) {
        return resolve();
      } else {
        setTimeout(() => {
          checkIsCompleted();
        }, 30);
      }
    };
    checkIsCompleted();
  });
}
