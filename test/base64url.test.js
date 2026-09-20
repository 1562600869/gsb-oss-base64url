const fs = require('fs');
const test = require('tap').test;
const base64url = require('..');
const testBuffer = fs.readFileSync(__dirname + '/test.jpg');

function base64(s) {
  return Buffer.from(s, 'binary').toString('base64');
}

test('from string to base64url', function (t) {
  const b64 = base64(testBuffer);
  const b64url = base64url(testBuffer, 'binary');
  t.same(b64url.indexOf('+'), -1, 'should not contain plus signs');
  t.same(b64url.indexOf('/'), -1, 'should not contain slashes');
  t.same(b64url.indexOf('='), -1, 'should not contain equal signs');
  t.same(b64.indexOf('+'), b64url.indexOf('-'), 'should replace + with -');
  t.same(b64.indexOf('/'), b64url.indexOf('_'), 'should replace / with _');
  t.end();
});

test('from base64url to base64', function (t) {
  const b64 = base64(testBuffer);
  const b64url = base64url(testBuffer, 'binary');
  const result = base64url.toBase64(b64url);
  t.same(result, b64, 'should be able to convert back');
  t.end();
});

test('from base64 to base64url', function (t) {
  const b64 = base64(testBuffer);
  const b64url = base64url(testBuffer, 'binary');
  const result = base64url.fromBase64(b64);
  t.same(result, b64url, 'should be able to convert to b64url from b64');
  t.end();
});

test('from base64url to string', function (t) {
  const b64url = base64url(testBuffer, 'binary');
  const result = base64url.decode(b64url, 'binary');
  t.same(result, testBuffer.toString('binary'), 'should be able to decode');
  t.end();
});

test('from base64url to string (buffer)', function (t) {
  const b64url = base64url(testBuffer, 'binary');
  const result = base64url.decode(new Buffer.from(b64url), 'binary');
  t.same(result, testBuffer.toString('binary'), 'should be able to decode');
  t.end();
});

test('from base64url to buffer', function (t) {
  const b64url = base64url(testBuffer, 'binary');
  const result = base64url.toBuffer(b64url);
  t.same(result, testBuffer, 'should be able to convert to buffer');
  t.end();
});

test('encode validates input', function (t) {
  const b64url = base64url(testBuffer, 'binary');

  var result = undefined;

  try {
    base64url.encode(1000);
  } catch (err) {
    result = err;
  }

  t.not(result, undefined, 'should validate encode input is string or Buffer');
  t.end();
});

test('example from readme', function(t) {
  const original = 'ladies and gentlemen, we are floating in space';
  const encoded = 'bGFkaWVzIGFuZCBnZW50bGVtZW4sIHdlIGFyZSBmbG9hdGluZyBpbiBzcGFjZQ';
  const resultEncoded = base64url.encode(original);
  const resultDecoded = base64url.decode(encoded);
  t.same(resultEncoded, encoded, 'these should match');
  t.same(resultDecoded, original, 'these should match too');
  t.end();
});

test('boundary lengths (byte length mod 3)', function (t) {
  const cases = [
    [Buffer.from(''), ''],
    [Buffer.from('f'), 'Zg'],
    [Buffer.from('fo'), 'Zm8'],
    [Buffer.from('foo'), 'Zm9v'],
    [Buffer.from('foob'), 'Zm9vYg'],
    [Buffer.from('fooba'), 'Zm9vYmE'],
    [Buffer.from('foobar'), 'Zm9vYmFy']
  ];
  cases.forEach(function (entry) {
    const input = entry[0];
    const expected = entry[1];
    const encoded = base64url(input);
    t.same(encoded, expected, 'encodes ' + input.length + ' byte(s) without padding');
    t.same(base64url.toBuffer(encoded), input, 'round-trips ' + input.length + ' byte(s) via toBuffer');
    t.same(base64url.decode(encoded), input.toString(), 'round-trips ' + input.length + ' byte(s) via decode');
  });
  t.end();
});

test('invalid encode inputs throw a diagnostic error', function (t) {
  [1000, null, undefined, {}, true, []].forEach(function (badInput) {
  t.throws(function () {
    base64url.encode(badInput);
  }, /string or Buffer/, 'rejects ' + String(badInput));
  });
  t.end();
});
