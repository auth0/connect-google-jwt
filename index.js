var expressJwt = require('express-jwt');
var validators = {};
var request = require('request');

function reload_validators (options) {
  request.get({
    url: 'https://www.googleapis.com/oauth2/v1/certs',
    json: true
  }, function (err, resp, certs) {
    Object.keys(certs).forEach(function (kid) {
      validators[kid] = expressJwt({
        audience: options.client_id,
        secret: certs[kid],
        issuer: ["accounts.google.com", "https://accounts.google.com"]
      });
    });
  });
}

module.exports = function (options) {

  setTimeout(function () {
    reload_validators(options);
  }, 24 * 60 * 60); // since Google said that can change daily

  reload_validators(options);

  return function (req, res, next) {
    var auth_header = req.get('Authorization');

    if (!auth_header || !auth_header.match(/^Bearer\s/)) {
      return res.status(401).send('missing authorization header');
    }

    var token = auth_header.replace(/^Bearer\s/, '');
    var header, kid;

    try {
      header = JSON.parse(Buffer(token.split('.')[0], 'base64').toString());
    }catch(err) {
      return res.send(401, "can't parse the JWT's header");
    }

    kid = header.kid;

    if (!kid) {
      return res.send(401, "missing kid in JWT's header");
    }

    validators[kid](req, res, next);
  };

};
