const querystring = require('querystring')
const http = require('http')
const server = require('../index')
const hostname = '127.0.0.1'
const port = 3000

module.exports = {
  setUp: function (callback) {
    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`)
      callback()
    })
  },
  tearDown: function (callback) {
    server.close(() => {
      console.log('server stopped listening')
      callback()
    })
  },
  directHttpCallSuccess: function (test) {
    const input = 1
    const expectedOutput = 2
    const postData = querystring.stringify({
      number: input
    })

    const options = {
      hostname,
      port,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const req = http.request(options, (res) => {
      test.equal(res.statusCode, 200)
      res.setEncoding('utf8')
      let s = ''
      res.on('data', (chunk) => {
        s += chunk
      })
      res.on('end', () => {
        test.ok(new RegExp('New number: ' + expectedOutput).test(s))
        test.done()
      })
    })

    req.on('error', (e) => {
      throw new Error(`problem with request: ${e.message}`)
    })

    // Write data to request body
    req.write(postData)
    req.end()
  },
  directHttpCallFailure: function (test) {
    const input = 'foo'
    const postData = querystring.stringify({
      number: input
    })

    const options = {
      hostname,
      port,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const req = http.request(options, (res) => {
      test.equal(res.statusCode, 400)
      res.setEncoding('utf8')
      let s = ''
      res.on('data', (chunk) => {
        s += chunk
      })
      res.on('end', () => {
        test.ok(new RegExp('Bad Request', 'i').test(s))
        test.done()
      })
    })

    req.on('error', (e) => {
      throw new Error(`problem with request: ${e.message}`)
    })

    // Write data to request body
    req.write(postData)
    req.end()
  },

  simulateUserInteractionSuccess: function (test) {
    const puppeteer = require('puppeteer');

    (async () => {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.goto(`http://${hostname}:${port}`, { waitUntil: 'networkidle2' })
      await page.focus('input[name="number"]')
      const keyboard = await page.keyboard
      keyboard.press('1')
      await Promise.all([page.waitForNavigation(), page.click('input[type="submit"]')])
      const content = await page.content()
      test.ok(new RegExp('New number: 2').test(content))
      await browser.close()
      test.done()
    })()
  }
}
