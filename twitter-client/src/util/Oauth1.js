// 1. Base string
function oAuthBaseString (method, url, params, key, token, timestamp, nonce) {
  return (
    method +
    '&' +
    percentEncode(url) +
    '&' +
    percentEncode(genSortedParamStr(params, key, token, timestamp, nonce))
  )
}
// 2. Signing key
function oAuthSigningKey (consumer_secret, token_secret) {
  return consumer_secret + '&' + token_secret
};
// 3. Signature
function oAuthSignature (base_string, signing_key) {
  const signature = hmac_sha1(base_string, signing_key)
  return percentEncode(signature)
};
// Supporting functions

// Percent encoding
function percentEncode (str) {
  return encodeURIComponent(str).replace(/[!*()']/g, (character) => {
    return '%' + character.charCodeAt(0).toString(16)
  })
};
// HMAC-SHA1 Encoding, uses jsSHA lib
const jsSHA = require('jssha')
function hmac_sha1 (string, secret) {
  const shaObj = new jsSHA('SHA-1', 'TEXT')
  shaObj.setHMACKey(secret, 'TEXT')
  shaObj.update(string)
  const hmac = shaObj.getHMAC('B64')
  return hmac
};
// Merge two objects
function mergeObjs (obj1, obj2) {
  for (const attr in obj2) {
    obj1[attr] = obj2[attr]
  }
  return obj1
};
function genSortedParamStr (params, key, token, timestamp, nonce) {
  // Merge oauth params & request params to single object
  const paramObj = mergeObjs(
    {
      oauth_consumer_key: key,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_token: token,
      oauth_version: '1.0'
    },
    params
  )
  // Sort alphabetically
  const paramObjKeys = Object.keys(paramObj)
  const len = paramObjKeys.length
  paramObjKeys.sort()
  // Interpolate to string with format as key1=val1&key2=val2&...
  let paramStr = paramObjKeys[0] + '=' + paramObj[paramObjKeys[0]]
  for (let i = 1; i < len; i++) {
    paramStr += '&' + paramObjKeys[i] + '=' + percentEncode(decodeURIComponent(paramObj[paramObjKeys[i]]))
  }
  return paramStr
};
function getAuthorization (httpMethod, baseUrl, reqParams) {
  // Get acces keys

  const keysJson = require('../config/config.js')
  const btoa = require('btoa')

  const consumerKey = keysJson.consumer_key
  const consumerSecret = keysJson.consumer_secret
  const accessToken = keysJson.access_token_key
  const accessTokenSecret = keysJson.access_token_secret
  // timestamp as unix epoch
  const timestamp = Math.round(Date.now() / 1000)
  // nonce as base64 encoded unique random string
  const nonce = btoa(consumerKey + ':' + timestamp)
  // let nonce = Buffer.from(consumerKey + ":" + timestamp, "binary").toString("base64");
  // let nonce = Buffer.from(consumerKey + ":" + timestamp).toString("base64");
  // generate signature from base string & signing key
  const baseString = oAuthBaseString(
    httpMethod,
    baseUrl,
    reqParams,
    consumerKey,
    accessToken,
    timestamp,
    nonce
  )
  const signingKey = oAuthSigningKey(consumerSecret, accessTokenSecret)
  const signature = oAuthSignature(baseString, signingKey)
  // return interpolated string
  return (
    'OAuth ' +
    'oauth_consumer_key="' +
    consumerKey +
    '",' +
    'oauth_token="' +
    accessToken +
    '",' +
    'oauth_signature_method="HMAC-SHA1",' +
    'oauth_timestamp="' +
    timestamp +
    '",' +
    'oauth_nonce="' +
    nonce +
    '",' +
    'oauth_version="1.0",' +
    'oauth_signature="' +
    signature +
    '"'

  )
}
exports.getAuthorization = getAuthorization

exports.oAuthBaseString = oAuthBaseString
exports.oAuthSigningKey = oAuthSigningKey
exports.oAuthSignature = oAuthSignature
exports.percentEncode = percentEncode
exports.hmac_sha1 = hmac_sha1
exports.mergeObjs = mergeObjs
exports.genSortedParamStr = genSortedParamStr
