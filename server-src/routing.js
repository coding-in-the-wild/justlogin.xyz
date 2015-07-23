var url = require('url')
var ecstatic = require('ecstatic')
require('string.prototype.startswith')

var config = require('../config.json')
var serve = ecstatic({
	root: config.staticDir
})

module.exports = function (core) {
	return function requestHandler(req, res) {
		var parsed = url.parse(req.url, true)
		var authAttempt = parsed.pathname.startsWith(config.endpoints.token)

		if (authAttempt) {
			var token = parsed.query.token
			core.authenticate(token, function (err, addr) {
				var pathname = err ? '/loginFailure.html' : '/loginSuccess.html'

				res.writeHead(307, { Location: url.resolve(req.url, pathname) })
				res.end()
			})
		} else {
			serve(req, res)
		}
	}
}
