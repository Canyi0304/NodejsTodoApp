var router = require('express').Router();

router.use(isLogin);

router.get('/game', function (req , res) {
    
    res.send('게임을 서비스해주는 페이지입니다.');

})


router.get('/webtoon', function (req , res) {
    
    res.send('웹툰을 볼수 있는 페이지입니다.');

})

function isLogin(req, res, next ) {
    if(req.user){
        next();
    }
    else{
        res.send('로그인 해주세요');
    }
}


module.exports = router;