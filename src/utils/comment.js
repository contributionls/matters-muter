import debug from "./debug";
import $ from "jquery";
import log from "./log";
import _ from "lodash";
import { isBelongUsernames } from "./common";
import md5 from "js-md5";
const GLOBAL_COMMENTS_MAP = {};
export function initFilterComment(opts) {
  opts = {
    mutedUsers: [],
    ...opts
  };
  // when init, handle the document
  filterComments(opts);

  // listen comments load-mmore button, when the load-more button clicked handle the document(for hidden the later elements)
  $("button.more-button").click(e => {
    delayFilterComment(opts);
  });

  addClickListenerBySection("#latest-responses");
  addClickListenerBySection("#featured-comments");
}
function addClickListenerBySection(section) {
  // listen page comments load-mmore button,when the load-more button clicked handle the document(for hidden the later elements)
  $(`${section} > div > button`).click(e => {
    debug("load more button clicked");
    // loop check if load completed
    isLoadCommentsCompleted(section)
      .then(() => {
        debug("load comments completed");
        filterComments(opts);
      })
      .catch(() => {
        debug("check loading comments fail");
        // even fail, retry replace
        filterComments(opts);
      });
  });

  // listen show-hidden-button, when the button clicked, replace the origin html
  $(section).click(e => {
    if (e.target && e.target.className === "matter-muter-comment-placeholder") {
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
          $selector.addClass("matters-muter-comment-skip");
        }
      }
    }
  });
}
function delayFilterComment(opts) {
  setTimeout(() => {
    filterComments(opts);
  }, opts.timeout || 10);
}
// affective function
export function filterComments(opts) {
  // start
  debug("start filterComments");
  debug("options: %o", opts);

  // get all selectors that need to mute

  const mutedComments = getNeedMutedComments(opts);
  debug("all selectors that need to mute", mutedComments);
  // replace with the specific html
  mutedComments.forEach(mutedComment => {
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
          selector: mutedComment.contentSelector,
          username: mutedComment.username,
          name: mutedComment.name
        })
      );
    }
  });
  debug("GLOBAL_COMMENTS_MAP", GLOBAL_COMMENTS_MAP);
}
export function getCommentReplacedHtml(opts) {
  return `<p class="matter-muter-comment-placeholder" data-selector="${opts.selector}" data-id="${opts.id}" style="padding-top:0.2rem;cursor: pointer;color:#b3b3b3;">根據你的設置，該評論已被靜音，點擊查看原評論內容（為什麼？）</p>`;
}

export function getNeedMutedComments(opts) {
  const allLatestComments = getAllCommentsSelectorsBySection(
    "#latest-responses"
  );
  const allFeatureComments = getAllCommentsSelectorsBySection(
    "#featured-comments"
  );
  const allComments = allFeatureComments.concat(allLatestComments);
  return allComments.filter(item => {
    return !item.muted && !item.skip && isBelongUsernames(item.username, opts.mutedUsers);
  });
}
export function getAllCommentsSelectorsBySection(section) {
  let matchedSelectors = [];
  // find the muted users comments' elements from latest comments
  const $latestMainComments = $(`${section} > ul > li`);
  if ($latestMainComments && $latestMainComments.length > 0) {
    $latestMainComments.each((rootIndex, commentsElement) => {
      debug("comment,%s,start", rootIndex);
      const $commentsElement = $(commentsElement);
      // check comment type
      let contentType = "";
      const $content = $(
        `${section} > ul > li:nth-child(${rootIndex + 1}) > section > div`
      );
      if ($content.length > 0) {
        if ($content.hasClass("content-wrap")) {
          // comment type
          contentType = "comment";
        } else if ($content.hasClass("digest-wrap")) {
          contentType = "digest";
        }
      }
      debug("contentType", contentType);

      if (contentType === "comment") {
        // cal selector
        let selector = `${section} > ul > li:nth-child(${rootIndex +
          1}) > section`;
        const commentData = getDataByCommentElement($commentsElement);
        commentData.selector = selector;
        matchedSelectors.push(commentData);
        // check if sencond comment is exist
        const $descendantComments = $(`${selector} > div > ul > li`);
        // #featured-comments > ul > li:nth-child(2) > section > div > ul > li > section > div > div > p
        if ($descendantComments.length > 0) {
          // exist descendant comments
          $descendantComments.each((descendantIndex, descendantElement) => {
            const descendantCommentData = getDataByCommentElement(
              $(descendantElement)
            );
            const descendantCommentSelector =
              selector +
              `> div > ul > li:nth-child(${descendantIndex + 1}) > section`;
            descendantCommentData.selector = descendantCommentSelector;
            matchedSelectors.push(descendantCommentData);
          });
        }
      }

      debug("comment,%s,end", rootIndex);
    });
  } else {
    log.error("Can not find the comments element, the extension can not work");
  }
  // string handle
  matchedSelectors = matchedSelectors.map(item => {
    item.contentSelector = item.selector + ` > div > div`;
    return item;
  });
  // find the muted users comments' elements from featured comments
  return matchedSelectors;
}
function getDataByCommentElement($commentsElement) {
  const $username = $commentsElement.find(
    "> .container > header > div > section.author-row > section > a > span.username"
  );

  if ($username && $username.length > 0) {
    const username = $username.text().trim();
    const $comment = $(
      $username
        .parent()
        .parent()
        .parent()
        .parent()
        .parent()
        .parent()
    );
    const commentElementId = $comment.attr("id");
    const $content = $comment.find("> div > div");
    const content = $content.text();
    const $name = $comment.find(
      "> header > div > section.author-row > section > a > span.name"
    );

    const name = $name.text().trim();
    const $upVotes = $comment.find(
      "> div > footer > div > button:nth-child(1) > span > span"
    );
    const $downVotes = $comment.find(
      "> div > footer > div > button:nth-child(3) > span > span"
    );
    const upVotes = Number($upVotes.text().trim());
    const downVotes = Number($downVotes.text().trim());

    let muted = false;
    const $muterPlaceHolder = $content.find('> p.matter-muter-comment-placeholder')
    if($muterPlaceHolder.length>0){
      muted = true;
    }
    const commentItem = {
      username: username,
      name,
      upVotes,
      downVotes,
      element: $comment,
      contentElement: $content,
      content,
      muted,
      skip: $content.hasClass("matters-muter-comment-skip")
    };
    return commentItem;
  }
}

function isLoadCommentsCompleted(section) {
  const retryTimes = 300;
  let sum = 0;
  const $startLatestComments = $(`${section} ul li`);

  return new Promise((resolve, reject) => {
    const checkIsCompleted = function() {
      sum++;
      const $currentLatestComments = $(`${section} ul li`);
      if ($currentLatestComments.length > $startLatestComments.length) {
        return resolve();
      } else {
        setTimeout(() => {
          checkIsCompleted();
        }, 30);
      }
    };
    if (sum > retryTimes) {
      reject(new Error("check comments loading timeout"));
    } else {
      checkIsCompleted();
    }
  });
}
