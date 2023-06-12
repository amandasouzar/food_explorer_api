const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const fileUpload = require('express-fileupload');

const app = express()
const PORT = '3003'


app.use(fileUpload())
app.use(cors())
app.use(express.json())
app.use(routes)
app.use(express.static(__dirname + '/../public'));

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}.`)
})