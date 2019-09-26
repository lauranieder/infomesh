const fs = require('fs')
const rimraf = require("rimraf");
const { ncp } = require('ncp')
const { minify } = require('html-minifier')
const { ROOT } = require('./config')

const templatePath = 'public/index.html'

const rawTemplate = fs.readFileSync(templatePath, 'utf8')
const parsedTemplate = rawTemplate.replace(/%{ROOT}/g, ROOT)

const minifiedPageContent = minify(parsedTemplate, {
  removeComments: true,
  collapseWhitespace: true
})

const initializeDirectory = dir => {
  if (dir && fs.existsSync(dir)) {
    rimraf.sync(dir)
  }
  
  if (dir && !fs.existsSync(dir)){
    fs.mkdirSync(dir)
  }
}

const distDirectory = 'dist'
initializeDirectory(distDirectory)

const directoriesToCopy = [
  'config.js',
  'css/',
  'data/',
  'img/',
  'js/',
  'projects/',
  'template/'
]

for (const dir of directoriesToCopy) {
  ncp(dir, `${distDirectory}/${dir}`, err => {
    if (err) throw err
    console.log(`The directory "${dir}" has been copied!`)
  })
}

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

  if (dir) {
    initializeDirectory(`./${distDirectory}/${dir}`)
  }

  fs.writeFile(`./${distDirectory}/${route}`, minifiedPageContent, err => {
    if (err) throw err
    console.log(`The file "${route}" has been saved!`)
  })
}
