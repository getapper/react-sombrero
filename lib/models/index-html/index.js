const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const { create } = require('../../helpers/files')

class IndexHtml {
  constructor (html) {
    if (html) {
      this.html = html
    }
  }

  init(html) {
    const indexHtmlTemplate = fs.readFileSync(
      path.join(__dirname, '../../templates/index-html-template.ejs'),
      'ascii'
    )

    this.html = ejs.render(indexHtmlTemplate)
  }

  read() {

  }

  save() {
    create(path.join(process.GLOBAL.PRJ_DIR, 'assets/index.html'), this.html)
  }
}

module.exports = IndexHtml

