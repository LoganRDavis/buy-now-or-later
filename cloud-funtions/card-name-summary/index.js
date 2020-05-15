'use strict';
const cors = require('cors')({origin: true});
const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore();

function getCardNames() {
  return datastore.createQuery('bnolFinishStat')
  	.select(['cardName'])
    .run();
}

function analyze(bnolFinishStats) {
  let result = { total: 0};
  for(let bnolFinishStat of bnolFinishStats) {
    let cardName = bnolFinishStat.cardName;
    if(!(cardName in result)) {
      result[cardName] = 0;
    }
    result[cardName] += 1;
    result.total += 1;
  }
  return result;
}

exports.getSummary = (req, res) => {
  return cors(req, res, () => {
    return getCardNames().then(function([bnolFinishStats]) {
      let result = analyze(bnolFinishStats);
      return res.status(200).send(result);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });  
  });
};
