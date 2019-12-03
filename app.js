
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const ejsLint = require('ejs-lint');
const http = require('http');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const models = require("./models/index.js");

// var -> const

models.sequelize.sync().then(() => {
    console.log(" DB connected");
}).catch(err => {
    console.log("DB connection failed");
    console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    key: 'sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24000 * 60 * 60
    }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// 서버측 코드

// Node.js 기본 내장 모듈 불러오기
const fs = require('fs');

// 설치한 express모듈 불러오기
// const express = require('express');

// 설치한 socket.io 모듈 불러오기
const socket = require('socket.io');

// Node.js 기본 내장 모듈 불러오기
// const http = require('http');

// express 객체 생성
// const app = express();

// express http 서버 생성
const server = http.createServer(app);

// 생성된 서버를 socket.io에 바인딩
const io = socket(server);

const hostname = '192.168.0.9'
const port = 8080;

app.use(express.static(__dirname + '/public'));

// GET 방식으로 / 경로에 접속하면 실행 됨
app.get('/', function (req, res) {
    fs.readFile('index.html', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            // html파일이라는 것을 알려야하기 때문에 헤더에 해당 내용을 작성해서 보내줌
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            // 헤더를 작성했으면 이제 html 데이터를 보내줌
            res.write(data);

            // 모두 보냈으면 완료됐음을 알림
            // 반드시 해줘야함
            res.end(data);
        }
    });
});

// on은 소켓에서 해당 이벤트를 받으면 콜백함수가 실행됨
// connection이라는 이벤트가 발생할 경우 콜백함수가 실행됨
// io.sockets는 접속되는 모든 소켓들을 뜻함
io.sockets.on('connection', function(socket) {
    /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
    socket.on('newUser', function(name) {
        console.log(name + ' 님이 접속하였습니다.')

        /* 소켓에 이름 저장해두기 */
        socket.name = name

        /* 모든 소켓에게 전송 */
        io.sockets.emit('update', {
            type: 'connect',
            name: 'SERVER',
            message: name + '님이 접속하였습니다.'
        })
    })

    /* 전송한 메시지 받기 */
    socket.on('message', function(data) {
        /* 받은 데이터에 누가 보냈는지 이름을 추가 */
        data.name = socket.name

        console.log(data)

        /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
        socket.broadcast.emit('update', data);
    })

    /* 접속 종료 */
    socket.on('disconnect', function() {
        console.log(socket.name + '님이 나가셨습니다.')

        /* 나가는 사람을 제외한 나머지 유저에게 메시지 전송 */
        socket.broadcast.emit('update', {
            type: 'disconnect',
            name: 'SERVER',
            message: socket.name + '님이 나가셨습니다.'
        });
    })

    
})

//서버를 8080포트로 listen
server.listen(port, hostname, function() {
    console.log('서버 실행중...')
})

module.exports = app;