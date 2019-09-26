const fs = require('fs')
const { minify } = require('html-minifier')
const { ROOT } = require('./config')

const templatePath = './template/index.html'

const rawTemplate = fs.readFileSync(templatePath, 'utf8')
const parsedTemplate = rawTemplate.replace(/%{ROOT}/g, ROOT)

const minifiedPageContent = minify(parsedTemplate, {
  removeComments: true,
  collapseWhitespace: true
})

const routes = [
  'index.html',
  'home/index.html',
  'about/index.html',
  'hacks/index.html',
  'webdictionary/index.html',
  'webinfluencers/index.html',
  'weblandscape/index.html',
  'webphenomena/index.html',
  'worldwidemap/index.html'
]

for (const route of routes) {
  const pathItems = route.split('/')
  const [dir] = pathItems.length > 1 ? pathItems : []

  if (dir && !fs.existsSync(dir)){
    fs.mkdirSync(dir)
  }

  fs.writeFile(`./${route}`, minifiedPageContent, err => {
    if (err) throw err
    console.log(`The file "${route}" has been saved!`)
  })
}

