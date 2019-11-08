import Route from 'route-parser';
export function getCurrentPage() {
  const pathname = window.location.pathname;
  var routeAuthor3 = new Route('/@:author/comments');
  const matchedAuthor3 = routeAuthor3.match(pathname);
  var routeAuthor4 = new Route('/@:author/comments');
  const matchedAuthor4 = routeAuthor4.match(pathname);
  var routeAuthor = new Route('/@:author');
  const matchedAuthor = routeAuthor.match(pathname);
  var routeAuthor2 = new Route('/@:author/');
  const matchedAuthor2 = routeAuthor2.match(pathname);
  const routeDetail = new Route('/@:author/:id');
  const matchedDetail = routeDetail.match(pathname);
  const routeDetail2 = new Route('/@:author/:id/');
  const matchedDetail2 = routeDetail2.match(pathname);
  const results = [];
  if (matchedAuthor3 || matchedAuthor4 || matchedAuthor || matchedAuthor2) {
    results.push('author');
  } else if (matchedDetail || matchedDetail2) {
    results.push('detail');
  } else {
    results.push('unknow');
  }
  // param
  results.push(
    matchedAuthor3 ||
      matchedAuthor4 ||
      matchedAuthor ||
      matchedAuthor2 ||
      matchedDetail ||
      matchedDetail2
  );
  return results;
}
