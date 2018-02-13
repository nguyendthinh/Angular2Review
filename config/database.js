const crypto = require('crypto').randomBytes(256).toString('hex');
// provides cryptographic functionality

module.exports = {
  uri: 'mongodb://localhost:27017/mean-angular-2',
  secret: crypto,
  db: 'mean-angular-2'
}
