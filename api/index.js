const express = require('express')
const bodyParser = require('body-parser')
//const multer = require('multer')

const app = express()
app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		limit: '50mb',
		extended: true,
		parameterLimit: 100000
	})
)

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		console.log('Hello')
// 		console.log(file)
// 		const dir = '/static'
// 		cb(null, dir)
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, file.fieldname + '.' + file.mimetype.split('/')[1])
// 	}
// })
//
// const upload = multer({
// 	storage: storage
// })

// app.post('/getImages', upload.any(), function(req, res) {
// 	console.log('Images are being uploaded')
// 	res.end()
// })

app.get('/', (req, res) => {
	res.send('hello')
	res.end()
})

// Error handler
app.use((err, req, res, next) => {
	console.error(err) // eslint-disable-line no-console
	res.status(401).send(err + '')
})

// Export the server middleware
module.exports = {
	path: '/api/index',
	handler: app
}