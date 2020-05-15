'use strict';
const cors = require('cors')({origin: true});
const uuidv4 = require('uuid/v4');
const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore();

function bnolFinishStat(cardName, browser, mobileDevice, duration, ipAddress) {
  this.createdDate = new Date();
  this.id = uuidv4();

  if (typeof(cardName) !== 'string' || cardName.length === 0) {
    throw new Error('Invalid card name');
  }

  if (typeof(browser) !== 'string' || browser.length === 0) {
    throw new Error('Invalid browser');
  }

  if (typeof(mobileDevice) !== 'boolean') {
    throw new Error('Invalid mobile device');
  }

  if (typeof(duration) !== 'number' || isNaN(duration)) {
    throw new Error('Invalid duration');
  }

  if (typeof(ipAddress) !== 'string' || ipAddress.length === 0) {
    throw new Error('Invalid ip address');
  }

  this.cardName = cardName;
  this.browser = browser;
  this.mobileDevice = mobileDevice;
  this.duration = duration;
  this.ipAddress = ipAddress;
}

function saveStat(bnolFinishStat) { 
  const entity = {
    key: datastore.key(['bnolFinishStat', bnolFinishStat.id]),
    data: bnolFinishStat,
  };
  return datastore.save(entity);
}

exports.acceptStat = (req, res) => {
  return cors(req, res, () => {
    let body = req.body;
    let newStat;

    try {
      newStat = new bnolFinishStat(
        body.cardName,
        body.browser,
        body.mobileDevice,
        body.duration,
        req.ip
      );
    } catch (err) {
      return res.status(400).send(err);
    }

    return saveStat(newStat).then(function() {
      return res.status(201).send();
    }).catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });  
  });
};
