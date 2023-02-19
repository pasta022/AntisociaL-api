const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('hey its users');
})

module.exports = router;