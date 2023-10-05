var express = require('express');
var models = require('../models');
const { Op } = require('sequelize');

var router = express.Router();

async function getJSON(element) {
  const company = await element.getCompany();
  let result = Object.assign(JSON.parse(JSON.stringify(element)), JSON.parse(JSON.stringify(company)));
  delete result.채용내용;
  delete result.회사_id;
  return result;
}

router.get('/', async function(req, res, next) {
  try {
    if (req.query.search) {
      console.log(req.query.search);
      var recruit = await models.Recruit.findAll({ 
        where: { 
          [Op.or]: [
            { 채용포지션: {[Op.substring]: req.query.search} },
            { 채용내용: {[Op.substring]: req.query.search} },
            { 사용기술: {[Op.substring]: req.query.search} }
          ]
        }
      });
    }
    else {
      var recruit = await models.Recruit.findAll();
    }
    const recruit_list = await Promise.all(recruit.map(function(element) {
      return getJSON(element);
    }));
    res.status(200).send(recruit_list);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/:id', async function(req, res, next) {
  let recruit = await models.Recruit.findByPk(req.params.id);
  const company = await recruit.getCompany();
  const recruit_list = await company.getRecruits({ attributes: ['채용공고_id'] });
  const list_json = { '회사가올린다른공고': recruit_list };
  let result = Object.assign(JSON.parse(JSON.stringify(recruit)), JSON.parse(JSON.stringify(company)), list_json);
  delete result.회사_id;
  res.send(result);
});

router.patch('/:id/modify', async function(req, res, next) {
  const key = await models.Recruit.findByPk(req.params.id, { attributes: ['채용공고_id'] });
  let body = req.body;
  delete body.채용공고_id;
  delete body.회사_id;
  const recruit = await models.Recruit.update(
    body, 
    { where: { 채용공고_id: key.채용공고_id} }
  );
  if (recruit[0] === 0) {
    res.status(404).send('Fail');
  }
  else {
    res.status(200).send(await models.Recruit.findByPk(req.params.id));
  }
});

router.delete('/:id/delete', async function(req, res, next) {
  const recruit = await models.Recruit.findByPk(req.params.id, { attributes: ['채용공고_id'] });
  if (recruit === null) {
    res.status(404).send('No Data Found');
    return;
  }
  const deleted = await models.Recruit.destroy({ where: { 채용공고_id: recruit.채용공고_id } });
  if (deleted === 0) {
    res.status(404).send('Fail');
  }
  else {
    res.status(200).send("DELETE Success");
  }
});

module.exports = router;