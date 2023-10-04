var express = require('express');
var models = require('../models');

var router = express.Router();

async function getJSON(element) {
  const recruits = await element.getRecruits({ joinTableAttributes: ['사용자_id', '채용공고_id'] });
  let result = Object.assign(JSON.parse(JSON.stringify(element)), JSON.parse(JSON.stringify(recruits)));
  return result;
}

router.get('/', async function(req, res, next) {
  const users = await models.User.findAll();
  // const result = await Promise.all(users.map(function(element) {
  //   return getJSON(element);
  // }));
  res.send(users);
});

/* GET users listing. */
router.get('/create', async function(req, res, next) {
  const user = await models.User.create();
  res.send(user);
});

router.get('/:id', async function(req, res, next) {
  const user = await models.User.findOne({ offset: (req.params.id - 1), attributes: ['사용자_id'] });
  const recruits = await models.UserRecruits.findAll({ where: { 사용자_id: user.사용자_id } });
  res.send(recruits);
})

router.get('/:id/apply/:recruit', async function(req, res, next) {
  const user = await models.User.findOne({ offset: (req.params.id - 1) });
  const recruit = await models.Recruit.findByPk(req.params.recruit);
  if (await models.UserRecruits.findOne({ where: { 사용자_id: user.사용자_id, 채용공고_id: req.params.recruit } })) {
    res.status(406).send('Already Applied');
    return;
  }
  await recruit.addUsers(user);
  const result = await user.addRecruits(recruit);
  res.send(result);
});

module.exports = router;
