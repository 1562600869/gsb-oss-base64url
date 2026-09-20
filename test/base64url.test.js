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

test('pad-string pads to multiple of 4', function (t) {
  t.same(base64url.toBase64('A'), 'A===', 'len % 4 == 1 needs 3 pads');
  t.same(base64url.toBase64('AA'), 'AA==', 'len % 4 == 2 needs 2 pads');
  t.same(base64url.toBase64('AAA'), 'AAA=', 'len % 4 == 3 needs 1 pad');
  t.same(base64url.toBase64('AAAA'), 'AAAA', 'len % 4 == 0 needs no pads');
  t.end();
});

test('round-trip for byte lengths mod 3 in {0,1,2}', function (t) {
  ['foo', 'fo', 'f', ''].forEach(function (s) {
    const encoded = base64url.encode(s);
    t.same(encoded.indexOf('='), -1, 'no padding left in base64url for ' + JSON.stringify(s));
    t.same(base64url.decode(encoded), s, 'decode(encode(x)) round-trips for ' + JSON.stringify(s));
  });
  t.end();
});

test('binary round-trip via toBuffer(encode(buffer))', function (t) {
  const encoded = base64url.encode(testBuffer);
  t.same(encoded.indexOf('+'), -1, 'no plus signs');
  t.same(encoded.indexOf('/'), -1, 'no slashes');
  t.same(encoded.indexOf('='), -1, 'no equal signs');
  t.same(base64url.toBuffer(encoded), testBuffer, 'toBuffer(encode(buf)) round-trips');
  t.end();
});

test('encode rejects non-string/non-Buffer input', function (t) {
  [1000, { a: 1 }, null, undefined].forEach(function (bad) {
    t.throws(function () { base64url.encode(bad); }, 'should throw for ' + JSON.stringify(bad));
  });
  t.end();
});
