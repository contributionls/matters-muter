import loglevel from 'loglevel';
import loglevelMessagePrefix from 'loglevel-message-prefix';
loglevelMessagePrefix(loglevel, {
  staticPrefixes: ['matters-muter']
});
export default loglevel