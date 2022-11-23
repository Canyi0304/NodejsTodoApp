const express = require('express');
const app = express();


require('dotenv').config();

//app.use : 미들웨어
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

app.use('/public', express.static('public'));

//put기능 사용
const methodOverride  = require('method-override');
app.use(methodOverride('_method'));


//쿠키
const cookieParser = require ('cookie-parser');
app.use(cookieParser());


//passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//세션
const session = require('express-session');
//세션 미들웨어
app.use(session({
    secret :'1111',
    resave : false,  //다시 저장안함
    saveUninitialized : true
}));


//passport 미들웨어
app.use(passport.initialize());
app.use(passport.session());

//list.html > list.ejs
app.set('view engine', 'ejs');  

//monggodb 아틀라스
//mongodb+srv://canyi:<password>@cluster0.uli6ovl.mongodb.net/?retryWrites=true&w=majority
const mogoClient = require('mongodb').MongoClient;

var db; 

mogoClient.connect(process.env.DB_URL,function(err,client){
    if(err){
        return console.log(err)
    }

    db = client.db('TodoApp');

//     db.collection('post').insertOne({todo: '테스트', date: '테스트', _id:1}, function(err,result){

//         if (err) {
//             console.log(err);
//         }
//         if(result){
//             console.log(result);
//         }
        
// });


// app.listen(8080, function() {

// console.log('listening on 8080');
// });
});


//설정할수 있는 port : 65535종류
//누군가가 /webtoon 방문하면 웹툰 관련 안내문을 띄워주자
//라우터 get.post


app.listen(process.env.PORT, function() {
    
    console.log('listen on' + process.env.PORT);

});


app.get('/game', function (req , res) {
    
    res.send('게임을 서비스해주는 페이지입니다.');

})


app.get('/webtoon', function (req , res) {
    
    res.send('웹툰을 볼수 있는 페이지입니다.');

})

// app.get('/', function (req , res) {
    
//     //res.send('홈입니다.');
//     res.sendFile(__dirname + '/index.html');

// })

// app.get('/write', function (req , res) {
    
//     //res.send('홈입니다.');
//     res.sendFile(__dirname + '/write.html');

// })



//add 경로 post 요청 (write.html)
app.post('/add',(req, res) => {
    //console.log(req);
    // console.log(req.body.title);
    // console.log(req.body.date);
    
    db.collection('counter').findOne({name: 'postcnt'}, function(err,result){
        if (err) {
            console.log(err);
        }
        if(result){
            console.log(result);
        }
        //Unique id 생성
        //console.log(result.totalPost);
        var totalCount = result.totalPost;

        //res.send('홈입니다.');

        db.collection('post').insert({_id: totalCount+1 ,todo:req.body.title, date:req.body.date});
        console.log("전송완료");
        // res.send("전송완료");

        //res.sendFile(__dirname + '/list.html');
        //Operator: 
        //set(변경), 
        //inc(증가), 
        //min (기존값보다 적을때만 변경), 
        //rename (key의 이름 변경))
        db.collection('counter').updateOne({name: 'postcnt'}, {$inc : {totalPost : 1}}, function(err,result){
            if (err) {
                return console.log(err);
            }

        });
    });   

    //입력완료한 다음 홈으로 이동
    res.redirect("/");
    
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

app.get('/list', function (req , res) {
    
    //DB에 있는 POST collection 가져오기
    //find() 함수는 collection으로 가져온 함수를 string로 가져옴 
    db.collection('post').find().toArray(function(err,result){
            console.log(result);
            res.render('list.ejs', {posts : result});
    });
    
})

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


// app.get('/count', function(req, res) {
    
//     if (req.cookies.count) {
//         var count = parseInt(req.cookies.count);
//     }
//     else{
//         var count  = 0;
//     }

//     count = count +1;

//     res.cookie('count',count);
//     res.send('count :' + req.cookies.count); 

//     // res.cookie('count',1);
//     // res.send('count :' + req.cookies.count); //cookie('count',req.cookies.count);
    

// })


//세션
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
    
    res.send('result' + req.session.count);
})


//로그인 라우터
app.get('/login', function (req , res) {
    
    res.render('login.ejs', {});

})

//로그인 post 처리
// app.post('/login', function (req , res) {
    
//     let userId = req.body.id;
//     let userPw = req.body.pw;

//     console.log(userId);
//     console.log(userPw);

//     db.collection('login').findOne({id : userId}, function(err, result){
        
//         if(err) return console.log(err);
//         if(!result){
//             res.send("존재하지 않는 아이디입니다.");
//             // res.redirect('/login');
//         }
//         else{

//             console.log(result);
//             if (result.pw == userPw) {
//                 res.send("로그인 되었습니다.");
//                 res.redirect('/');
//             }
//             else{
//                 res.redirect('/login');
//             }
//         }
//     })
// })

//로그인 passport 인증
app.post('/login', passport.authenticate('local',{
            
            failureRedirect : '/fail'

        }), function (req , res) {
    
        res.redirect('/');
})

passport.use(new LocalStrategy({
    
    usernameField : 'id',
    passwordField : 'pw',
    session : true,
    passReqToCallback : false,
}, function(inputid, inputpw, done){
    console.log(inputid);
    console.log(inputpw);
    
    db.collection('login').findOne({id :inputid}, function (err,result,res){

        if(err) return done(err); //done : 
        if(!result){
            return done(null, false, {message : '존재하지 않는 아이디입니다.'});  //null: server error code
        }
        if(result.pw == inputpw){
            return done(null, result);        //result는 passport.serializeUser의 user로 넘어간다.
        }
        else{
            return done(null, false, {message : '비번이 틀렸습니다.'});
        }
        
    })
}))

//쿠키에 세션 등록
passport.serializeUser(function(user, done){
    done(null,user.id);
})

//세션데이터를 가진 사람을 db에서 찾기
passport.deserializeUser(function (userid, done){
    db.collection('login').findOne({id: userid}, function(err, result){
        
        done(null,result);
        console.log(result);
    })
    
});

app.get('/fail', function (req , res) {
    
    res.send('로그인해주세요');

})


//회원가입
//로그인 라우터
app.get('/signup', function (req , res) {
    
    res.render('signup.ejs', {});

})

//회원가입
app.post('/signup', function (req , res) {


    db.collection('login').insertOne({id: req.body.id, pw :req.body.pw, mobile: req.body.mobile, country: req.body.country}, function (err, result){
        
        if(err) return console.log(err);
        console.log(result);
        res.redirect('/login');
    })

})



//마이페이지
app.get('/mypage', isLogin,function (req , res) {
    
    res.render('mypage.ejs',{사용자: req.user});

})

//login 할경우 mypage보이기 설정
function isLogin(req, res, next ) {
    if(req.user){
        next();
    }
    else{
        res.send('로그인 해주세요');
    }
}



//검색기능
app.get('/qtest',function (req , res) {
    
    res.send(req.query.id+ ',' + req.query.pw);
    // res.send(req.query.id);    

})