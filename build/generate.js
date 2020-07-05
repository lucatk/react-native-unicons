const path = require('path')
const fs = require('fs-plus')
const cheerio = require('cheerio')

const iconsJsonPath = path.join(process.cwd(), 'icons')

const monochromeClass = fill => {
  switch ((fill || '').toLowerCase()) {
  case '#6563ff':
    return 'uim-primary'
  case '#a2a1ff':
    return 'uim-tertiary'
  case '#c1c0ff':
    return 'uim-quaternary'
  }
}
const iconsReducer = (sourcePath) => (obj, icon, i) => {
  const svgFile = fs.readFileSync(path.resolve(sourcePath, icon.svg), 'utf-8')

  let data = svgFile.replace(/<svg[^>]+>/gi, '').replace(/<\/svg>/gi, '')

  // Get Path Content from SVG
  const $ = cheerio.load(data, {
    xmlMode: true
  })
  const svgElements = $('path, circle')
  const svg = svgElements.map((_, el) => {
    const type = $(el)[0].name
    const cls = monochromeClass($(el).attr('fill'))
    const opacity = $(el).attr('opacity')

    let str = `<${type} `
    if (cls) {
      str += `class="${cls}" `
    }

    if (type === 'path') {
      const d = $(el).attr('d')
      if (d) {
        str += `d="${d}" `
      }
    } else if (type === 'circle') {
      const cx = $(el).attr('cx')
      const cy = $(el).attr('cy')
      const r = $(el).attr('r')
      if (cx) {
        str += `cx="${cx}" `
      }
      if (cy) {
        str += `cy="${cy}" `
      }
      if (r) {
        str += `r="${r}" `
      }
    }

    if (opacity) {
      str += `opacity="${opacity}" `
    }
    str += '/>'
    
    return str
  }).get().join('')

  return {
    ...obj,
    [icon.name]: svg,
  }
}

const styles = [
  {
    name: 'line',
    source: 'node_modules/@iconscout/unicons',
    config: require('@iconscout/unicons/json/line.json')
  },
]

const monochromeSourcePath = process.argv.slice(2)[0]
if (monochromeSourcePath) {
  const monochromeUniconsConfig = fs.readdirSync(path.resolve(monochromeSourcePath)).map(svg => {
    const name = path.basename(svg, '.svg')
    return { name, svg }
  })
  styles.push({
    name: 'monochrome',
    source: monochromeSourcePath,
    config: monochromeUniconsConfig
  })
} else {
  styles.push({
    name: 'monochrome',
    source: 'n/a',
    config: []
  })
}

// Clear Directories
fs.removeSync(iconsJsonPath)
fs.mkdirSync(iconsJsonPath)

styles.forEach(style => {
  console.log(`Generating icons for style "${style.name}" from source ${style.source}...`)
  const icons = style.config.reduce(iconsReducer(style.source), {})
  const location = path.join(iconsJsonPath, `${style.name}.json`)
  fs.writeFileSync(location, JSON.stringify(icons), 'utf-8')
  console.log(`Generated ${Object.keys(icons).length} icons for style "${style.name}".`)
})