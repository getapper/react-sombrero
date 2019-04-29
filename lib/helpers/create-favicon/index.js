const fs = require('fs')
const path = require('path')

function createFavicon() {
  fs.copyFileSync(path.join(__dirname, '../../../assets/img/favicon.png'), path.join(process.GLOBAL.PRJ_DIR, 'assets/public/favicon.png'), (err) => {
    if (err) throw err;
  });
}

module.exports = {
  createFavicon
}
