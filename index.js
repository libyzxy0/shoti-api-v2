const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const apiRoutes = require('./routes/api');
const rootRoutes = require('./routes/root');
const connectDB = require('./database/connect');
const rateLimit = require('express-rate-limit');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['https://shoti-api.libyzxy0.repl.co/', 'https://notif-bot.libyzxy0.repl.co/']
  }
});

io.on('connection', (socket) => { });

//let db = require('./database/database');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

//app.use(limiter);


//Middlewares 
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(function(req, res, next) {
  req.io = io;
  next();
});

//Routes
app.use('/', rootRoutes)
app.use('/api', apiRoutes)


// Error handling middleware
app.use(notFound);
app.use(errorHandler);

//Database connection
(async (uri) => {
  try {
    await connectDB(uri);
    console.log("Connected to database!");
    //require('./utils/deleteAllKey.js')();
  } catch (error) {
    console.log("Error while connecting to database!\n" + error);
  }
})(process.env.MONGO_URI);
// Start the server
const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
