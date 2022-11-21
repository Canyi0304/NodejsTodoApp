//MySql 
const mysql = require('mysql');
const conn = mysql.createConnection({
    // host : 'localhost',
    // user: 'root',
    // password : 'piaoxin123',
    // database : 'node_db'
    
    host : '127.0.0.1',
    port: '3306',
    user: 'root',
    password : 'piaoxin123',
    database : 'node_db'
});

conn.connect();
conn.query('select * from todo', function (err, rows, fields){
            if (err) throw err;
            console.log(rows);
  });




const express = require('express');
const app = express();
//app.use : 미들웨어
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));


//설정할수 있는 port : 65535종류
//누군가가 /webtoon 방문하면 웹툰 관련 안내문을 띄워주자
//라우터 get.post


app.get('/game', function (req , res) {
    
    res.send('게임을 서비스해주는 페이지입니다.');

})


app.get('/webtoon', function (req , res) {
    
    res.send('웹툰을 볼수 있는 페이지입니다.');

})

app.get('/', function (req , res) {
    
    //res.send('홈입니다.');
    res.sendFile(__dirname + '/index.html');

})

app.get('/write', function (req , res) {
    
    //res.send('홈입니다.');
    res.sendFile(__dirname + '/write.html');

})

//add 경로 post 요청 (write.html)
app.post('/add',(req, res) => {
    //console.log(req);
    console.log(req.body.title);
    console.log(req.body.date);

    console.log("Connected!");
    //Mysql DB
    //방법1
    var sql  = `INSERT INTO todo (title, curdate) VALUES ('${req.body.title}', '${req.body.date}')`;
    conn.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    res.send('전송완료');

    //방법2 ? 입력방법 찾아보기
    // var sql = 'INSERT INTO todo VALUES ( ?, ?)';
    // var values1 = req.body.title;
    // var values2 = req.body.date;
    // conn.query(sql,values1,values2, function (err, result) {
    //     if (err) throw err;
    //     console.log("1 record inserted");
    //   });
    // res.send('전송완료');

    

})

app.listen(8080, function() {
    
    console.log('listening on 8080');

});


// app.get('/list', function (req , res) {
    
//     //res.send('홈입니다.');
    
//     conn.query('select * from todo', function (err, rows, fields){
//         if (err) throw err;
//         res.send(rows);
// });
//     res.sendFile('db에 데이터를 보냅니다.');

// });

