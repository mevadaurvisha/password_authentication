const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routers/router');
const server = express();
const port = process.env.PORT || 3007;
const db = require('./config/db');
const cookieparser = require('cookie-parser');
const passportCon = require('./config/passportCon');
const express_session = require('express-session');



const PATH= path.join(__dirname , "/views");
server.set('view engine' , 'ejs');
server.set('views', PATH);
server.use(cookieparser());
server.use(express_session({ secret: 'my_secret', resave: true, saveUninitialized: true }));
server.use(passportCon.initialize());
server.use(passportCon.session());

server.use(express.static(PATH));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use('/' , router);

server.listen(port , (err) => {
    if(!err){
        console.log(`server is running on http://localhost:${port}`);
        
    }

});