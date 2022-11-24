var router = require('express').Router();


var db; 
const mogoClient = require('mongodb').MongoClient;

mogoClient.connect(process.env.DB_URL,function(err,client){
    if(err){
        return console.log(err)
    }

    db = client.db('TodoApp');

});



router.get('/list', function (req , res) {
    
    //DB에 있는 POST collection 가져오기
    //find() 함수는 collection으로 가져온 함수를 string로 가져옴 
    db.collection('post').find().toArray(function(err,result){
            console.log(result);
            res.render('list.ejs', {posts : result});
    });
    
})


module.exports = router;