var express = require('express');
var models = require('../models');

var router = express.Router();

router.get('/', async function(req, res, next) {
  const companies = await models.Company.findAll();
  res.send(companies);
});

router.post('/insert', async function(req, res, next) {
  const company = await models.Company.create(req.body);
  console.log('Company: Insert Success');
  res.send(company);
});

router.get('/:id', async function(req, res, next) {
  const company = await models.Company.findOne({ offset: (req.params.id - 1) });
  res.send(company);
});

router.post('/:id/recruit/insert', async function(req, res, next) {
  const company = await models.Company.findOne({ offset: (req.params.id - 1) });
  const recruit = await models.Recruit.create(req.body);
  await company.addRecruit(recruit);
  res.send(recruit);
});

router.delete('/:id/delete', async function(req, res, next) {
  const company = await models.Company.findOne({ offset: (req.params.id - 1) });
  if (company === null) {
    res.status(404).send('No Data Found');
    return;
  }
  const recruit_ids = await company.getRecruits({ attributes: ['채용공고_id'] });
  await recruit_ids.map(async (element) => {
    await models.Recruit.destroy({ where: { 채용공고_id: element.채용공고_id } });
  });
  const deleted = await models.Company.destroy({ where: { 회사_id: company.회사_id } });
  if (deleted === 0) {
    res.status(404).send('Fail');
  }
  else {
    res.send('DELETE Success');
  }
});

module.exports = router;