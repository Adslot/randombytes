'use strict'

function oldBrowser () {
  throw new Error('secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11')
}

var crypto = global.crypto || global.msCrypto

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes
} else {
  module.exports = oldBrowser
}

function randomBytes (size, cb) {
  // in browserify, this is becomes an extended UInt8Array
  var bytes = new Buffer(size)

  // This will not work in older browsers.
  // See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
  try {
    crypto.getRandomValues(bytes)
  } catch (e) {
    console.warn('Using Math.random() instead of crypto.getRandomValues()!');
    for (var index in bytes) {
      bytes[index] = Math.floor(256 * Math.random());
    }
  }

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes)
    })
  }

  return bytes
}
