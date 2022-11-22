const express = require('express');
const app = express();

//app.use : 미들웨어
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

app.use('/public', express.static('public'));
//쿠키
const cookieParser = require ('cookie-parser');
app.use(cookieParser());


//세션
const session = require('express-session');
app.use(session({
    secret :'1111',
    resave : false,  //다시 저장안함
    saveUninitialized : true
}));



//세션 미들웨어 (session file store)
//const FileStore = require('session-file-store')(session);
// app.use(session({
//     secret :'1111',
//     resave : false,  //다시 저장안함
//     saveUninitialized : true,
//     store: new FileStore()      //FileStore 객체 생성
// }));

//세션 미들웨어 (session file store MySql)
//const MySQLStore = require('express-mysql-session')(session);
// app.use(session({
//     secret :'1111',
//     resave : false,  //다시 저장안함
//     saveUninitialized : true,
//     store: new MySQLStore({             //FileStore 객체 생성
//         host : '127.0.0.1',
//         port : 3306,
//         user : 'root',
//         password : 'piaoxin123',
//         database : 'node_db'
//     })      
// }));

//md5 비번 암호화
let md5 = require ('md5');

//salt
var salt = 'cscsc329320nd-do323';

//list.html > list.ejs
app.set('view engine', 'ejs');  

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


//회원가입
//로그인 라우터
app.get('/signup', function (req , res) {
    
    res.render('signup.ejs', {});

})

//회원가입
app.post('/signup', function (req , res) {

    console.log(req.body.id);
    console.log(req.body.pw);
    console.log(req.body.mobile);
    console.log(req.body.country);

    let sql = `insert into login (userid, userpw, mobile, country) values(
        "${req.body.id}",
        "${req.body.pw}",
        "${req.body.mobile}",
        "${req.body.country}"
    )`;

    conn.query(sql,function (err, rows, fields) {
        if(err){ 
            console.log(err);
        }
        else{
            res.redirect('/login');
        }
    })

})

//로그인 라우터
app.get('/login', function (req , res) {
    
    res.render('login.ejs', {});

})

//로그인 post 처리
app.post('/login', function (req , res) {
    
    let userId = req.body.id;
    let userPw = req.body.pw;

    console.log(userId);
    console.log(userPw);

    let sql = "select * from login";
    conn.query(sql, function (err,rows,fields) { 
        if(err){
            console.log(err);
        }
        
        //console.log(rows);
        for(let i=0; i<rows.length; i++){
            if(rows[i].userid == userId){
                
                console.log(md5(rows[i].userpw + salt));
                console.log(md5(userPw + salt));

                if(md5(rows[i].userpw + salt) == md5(userPw + salt)){
                    
                    console.log('로그인 되었습니다.');
                    req.session.userid = userId;
                    return res.redirect('/');
                }
                else{
                    console.log('비밀번호가 틀렸습니다.');
                    res.send('비밀번호가 틀렸습니다.');

                }
            }
            // else {
            //     res.send('아이디가 틀렸습니다.');      
            // }
        }
    })
})


app.get('/list', (req , res)=> {
    
    let sql = "select * from todo";
    let list = '';
    

    conn.query(sql, function(err, rows, fileds){
    
    if (err) {
        console.log(err);
    }
    else{
    //     for(let i =0; i < rows.length; i++){
    //         list += rows[i].title + ":" + rows[i].curdate + "<br/>";
    //     }
    //     res.send(list);
    console.log(rows);
    res.render("MysqlList.ejs", {posts: rows});
        
}
    })
    
    })

app.listen(8080, function() {
    
    console.log('listening on 8080');

});



//add 경로 post 요청 (write.html)
app.post('/add',(req, res) => {

    console.log(req.body.title);
    console.log(req.body.date);

    let sql = `insert into todo (title, curdate) values(
        ${req.body.title},
        ${req.body.date}
    )`;

    conn.query(sql,function (err, rows, fields) {
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/list');
        }
    })
    
});

app.delete('/delete', function (req , res) {
    
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, function(err,result){
        if(err) return console.log(err);
        console.log('삭제완료');
        res.status(200).send({message:'성공했습니다.'});
    });
    
})

//ejs

app.get('/write', function (req , res) {
    
            res.render('write.ejs', {});
   
})

app.get('/', function (req , res) {
          
            res.render('index.ejs', {});

})


app.get('/detail/:id', (req , res) => {
    console.log('상세페이지:',req.params.id);
    db.collection('post').findOne({_id: parseInt(req.params.id)}, function (err, result){
        if(err) return console.log(err);
        console.log(result);
        res.render('detail.ejs', {data : result});
    })
    
})


app.get('/editor/:id', (req , res) => {
    
    console.log(req.params.id);

    db.collection('post').findOne({_id:parseInt(req.params.id)},function (err, result){

        if(err) return console.log(err);
        console.log(result);
        res.render('editor.ejs', {post : result});
    })
    

})


app.put('/editor', function (req , res) {
    //폼에 담긴 todo 데이터, date 데이터를 가지고 db.collection(post)를 업데이트
    console.log('업데이트가 됩니다.');
    //$set 설정
    db.collection('post').updateOne({_id: parseInt(req.body.id)}, {$set : {todo : req.body.title, date: req.body.date}}, function (err, result){
        if(err) return console.log(err);
        console.log('수정완료');
        res.redirect('/list');
    })
})




//세션 count, temp, logout
app.get('/count', function(req, res) {
    
    if (req.session.count) {
        req.session.count++;
    }
    else{
        req.session.count = 1;
    }
    
    res.send('count :' + req.session.count);
    // req.session.count = 1;
    // res.send('hi session');
})

app.get('/temp', function(req, res) {
    
    // res.send('result' + req.session.count);
    res.send('result' + req.session.userid);
})



//세션 연결 강제로 끊기
app.get('/logout', function(req, res) {
    
    //delete req.session.count;
    delete req.session.userid;
    res.redirect("/");
})










