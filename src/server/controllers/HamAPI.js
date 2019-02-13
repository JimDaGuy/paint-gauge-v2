// Harvard Art Museum (HAM) Api Controller
const request = require('request');

const { HARVARD_KEY } = process.env;

const getRandomPainting = (req, res) => {
  const paintingNumParams = {
    apikey: HARVARD_KEY,
    classification: 'Paintings',
    size: 0
  };

  // Get number of paintings
  request(
    { url: 'https://api.harvardartmuseums.org/object', qs: paintingNumParams },
    (err, response, body) => {
      if (err) {
        throw err;
      }
      const parsedBody = JSON.parse(body);
      const paintNum = parsedBody.info.totalrecords;

      const randomPaintParams = {
        apikey: HARVARD_KEY,
        classification: 'Paintings',
        fields:
          'id,title,primaryimageurl,colors,dated,culture,medium,department,division,url,period,places',
        page: Math.floor(Math.random() * (paintNum + 1)),
        size: 1,
        height: '<500'
      };

      request(
        { url: 'https://api.harvardartmuseums.org/object', qs: randomPaintParams },
        (err2, response2, body2) => {
          if (err2) {
            throw err2;
          }

          const parsedBody2 = JSON.parse(body2);
          let randomPainting = parsedBody2.records[0];

          if (!randomPainting.primaryimageurl || !randomPainting.id) {
            getRandomPainting(req, res);
          } else {
            randomPainting = JSON.stringify(randomPainting);
            res.status(200).send(randomPainting);
          }
        }
      );
    }
  );
};

module.exports = {
  getRandomPainting
};
