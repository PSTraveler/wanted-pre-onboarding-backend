var express = require('express');
var models = require('../models');

var router = express.Router();

router.get('/', async function(req, res, next) {
  const users = await models.User.findAll();
  res.send(users);
});

/* INSERT User Data*/
router.get('/create', async function(req, res, next) {
  try {
    const user = await models.User.create();
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err)
  }
});

router.get('/:id', async function(req, res, next) {
  const user = await models.User.findOne({ offset: (req.params.id - 1)});
  res.send(user);
})

router.get('/:id/apply/:recruit', async function(req, res, next) {
  const user = await models.User.findOne({ offset: (req.params.id - 1) });
  const recruit = await models.Recruit.findByPk(req.params.recruit);
  if (await models.UserRecruits.findOne({ where: { 사용자_id: user.사용자_id, 채용공고_id: req.params.recruit } })) {
    res.status(406).send('Already Applied');
    return;
  }
  await recruit.addUsers(user);
  const result = await models.UserRecruits.findOne({ where: { 사용자_id: user.사용자_id } });
  res.status(200).send(result);
});

module.exports = router;
