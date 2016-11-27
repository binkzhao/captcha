'use strict'

const Canvas = require('canvas')

class CCaptcha {
  _getTextAndAnswer (type, chars, size) {
    if (type === 'text') {
      let text = ''
      for (let i = 0; i < size; i++) {
        text += chars[Math.round(Math.random() * (chars.length - 1))]
      }
      return [text, text]
    } else {
      return ['12345', 'Ah9K']
    }
  }

  getRandomColor () {
    let num = (Math.random() * 16777215 + 0.5) >> 0
    return '#' + ('00000' + num.toString(16)).slice(-6)
  }

  image ({
    type = 'text',
    size = 4,
    height = 40,
    width = 120,
    background = 'rgb(250, 164, 228)',
    noiseColor = 'rgb(78,42,10)',
    textColor = 'rgb(0,0,0)',
    lineWidth = 1,
    chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    noise = true,
    complexity = 2
  } = {}) {
    let fontSize = Math.round(height * 0.35 + (15 - complexity * 3))
    let canvas = new Canvas(width, height)
    let ctx = canvas.getContext('2d')

    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = textColor
    ctx.lineWidth = lineWidth
    ctx.font = fontSize + 'px sans'

    if (noise) {
      let noiseHeight = height
      ctx.strokeStyle = noiseColor
      for (let i = 0; i < 8; i++) {
        ctx.moveTo(Math.floor(0.08 * width), Math.random() * noiseHeight)
        ctx.bezierCurveTo(
          Math.floor(0.32 * width), Math.random() * noiseHeight,
          Math.floor(1.07 * width), Math.random() * noiseHeight,
          Math.floor(0.92 * width), Math.random() * noiseHeight
        )
        ctx.stroke()
      }
    }

    let modifier = complexity / 5
    ctx.strokeStyle = this.getRandomColor()
    let [text, answer] = this._getTextAndAnswer(type, chars, size)

    for (let i = 0; i < text.length; i++) {
      ctx.setTransform(
        Math.random() * modifier + 1 + modifier / 3,
        Math.random() * modifier + modifier / 3,
        Math.random() * modifier + modifier / 3,
        Math.random() * modifier + 1 + modifier / 3,
        (height * i) / 3 + (height - fontSize) / 3,
        height - (height - fontSize) / 2
      )
      ctx.fillText(text.charAt(i), i * 6, -8)
    }

    return { text: answer, image: this._getImage(canvas).next().value }
  }

  * _getImage (canvas) {
    yield canvas.toDataURL('image/png')
  }
}

module.exports = CCaptcha

