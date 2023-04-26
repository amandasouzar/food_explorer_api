const express = require('express')
const routes = require('./routes')

const app = express()
const PORT = '3003'

app.use(express.json())
app.use(routes)

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}.`)
})