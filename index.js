const http = require('http')
const querystring = require('querystring')
const addOne = require('./add-one')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(`
      <html>
        <body>
          <form action="/" method="post">
            <p>Add one to this number <input name="number"/></p>
            <input type="submit"> 
          </form>
        </body>
      </html>
    `)
  } else if (req.method === 'POST') {
    let s = ''
    req.on('data', (dat) => {
      s += dat
    })

    req.on('end', () => {
      let o
      try {
        o = querystring.decode(s)
      } catch (e) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/plain')
        res.end(e.message)
        return
      }
      if (!o.number) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/plain')
        res.end('Bad request')
        return
      }
      const n = parseInt(o.number)
      if (isNaN(n)) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/plain')
        res.end('Bad request')
        return
      }

      const m = addOne(n)
      if (isNaN(m)) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/plain')
        res.end('Server error')
        return
      }

      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(`
        <html>
          <body>
            <p> New number: ${m}</p>
            <form action="/" method="post">
              <p>Add one to this number <input name="number"/></p>
              <input type="submit"> 
            </form>
          </body>
        </html>
      `)
    })
  }
})

module.exports = server

if (require.main === module) {
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  })
}
