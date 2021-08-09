const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const logger = require('./middleware/logger')
const members = require('./Members')

const fileUpload = require('express-fileupload')
var fs = require('fs');
var http = require('http');

// http.createServer(function (req, res) {
  fs.readFile('demoFile.html', 'utf8', function(err, data) {
    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write(data);
    // return res.end();
    // remove all line breaks from html string
    console.log(data.replace(/(\r\n|\n|\r)/gm, ""))
  });
// }).listen(8080, () => console.log('Listening on port 8080'));

const app = express()

// Init middleware
app.use(logger);

// add fileUpload middleware
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }
}));

// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Homepage Route (usually it's either this or setting a static folder below)
// however both can be used, putting both in this file is just for demonstration purposes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Members App',
    members,
  })
})

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')))

// Members API routes
app.use('/api/members', require('./routes/api/members'))

app.post('/upload', function(req, res) {
  if (req.files && req.files.file) {
    const myFile = req.files.file; // the uploaded file object
    const uploadPath = __dirname + '/uploadDir/' + myFile.name;

    // move the file to a folder on the server
    myFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
      res.status(200).json({ msg: `${myFile.name} Uploaded` })
    });
  } else {
    return res.status(500).json({ msg: 'Error uploading' });
  }
});

const PORT = process.env.PORT || 5000

module.exports = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
