let express = require('express');
let router = express.Router();

function accumulate(req, res, next) {
  //  Accumulate events
  events = req.body;
  console.log('eh', events);

  return next();
}

function filter(e) {
	return true;
}

function print(req, res) {
  //  Print accumulted results

  console.log('accumulated events');
  return res.status(200).end();
}

router.post('/', accumulate);
router.post('/', print);

module.exports = router;
