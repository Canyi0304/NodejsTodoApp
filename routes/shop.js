var router = require('express').Router();


router.get('/pet', function (req , res) {
    
    res.send('펫을 서비스해주는 페이지입니다.');

})


router.get('/action', function (req , res) {
    
    res.send('액션을 볼수 있는 페이지입니다.');

})

module.exports = router;