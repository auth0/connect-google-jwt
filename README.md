Use Google's JWTs to authenticate calls to your backend API.

Google implements the standard OpenID Connect, after the authorization flow with `response_type=id_token` you will get a JWT in the client side of your application. You can use this JWT to authenticate calls to your api.

This middleware validate three things __expiration__, __audience__ and __signature__.

The signature is validated with the certs from https://www.googleapis.com/oauth2/v1/certs as stated in Google Docs [Validating an ID Token](https://developers.google.com/accounts/docs/OAuth2Login#validatinganidtoken). These certs are downloaded when your application starts and every 24hs.

If you want to validate JWT's from other sources (not google) use [express-jwt](http://github.com/auth0/express-jwt).

## Install

~~~
$ npm i connect-google-jwt
~~~

## Usage

In an express.js application:

~~~javascript
var googleJWT = require('connect-google-jwt');

app.configure(function () {
  //middlewares
  this.use('/api', googleJWT({
    client_id: 'your client id'
  }))
});

app.get('/api/messages', function (req, res) {
  req.user // you have the decoded JWT here
});
~~~

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.
