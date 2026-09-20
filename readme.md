# base64url  [![Build Status](https://secure.travis-ci.org/brianloveswords/base64url.png)](http://travis-ci.org/brianloveswords/base64url)

Converting to, and from, [base64url](http://en.wikipedia.org/wiki/Base64#RFC_4648)

# Install

```bash
$ npm install base64url
```

After installing with `npm` you can require this library from JavaScript or TypeScript:

JavaScript
```js
const base64url = require('base64url');
```

TypeScript:
```typescript
import base64url from "base64url";
```

# Usage

## CLI

The CLI has been removed. For the time being, please install `base64url@1.0.6` if you need the CLI.

## Library

### base64url(input: string | Buffer, encoding: string = "utf8"): string

### base64url.encode(input: string | Buffer, encoding: string = "utf8"): string

base64url encode `input`. Input should be a `string` or a `Buffer`.


Example

```js
> base64url("ladies and gentlemen, we are floating in space")
'bGFkaWVzIGFuZCBnZW50bGVtZW4sIHdlIGFyZSBmbG9hdGluZyBpbiBzcGFjZQ'
```

---

### base64url.decode(input: string, encoding: string = "utf8"): string

Convert a base64url encoded string into a raw string. The `encoding` argument can be used if the input is a string that's not utf8.

```js
> base64url.decode("cmlkZTogZHJlYW1zIGJ1cm4gZG93bg")
'ride: dreams burn down'
```

---

### base64url.fromBase64(input: string): string

Convert a base64 encoded string to a base64url encoded string.

Example

```js
> base64url.fromBase64('qL8R4QIcQ/ZsRqOAbeRfcZhilN/MksRtDaErMA==')
'qL8R4QIcQ_ZsRqOAbeRfcZhilN_MksRtDaErMA'
```

---


### base64url.toBase64(input: string): string

Convert a base64url encoded string to a base64 encoded string.

```js
> base64url.toBase64('qL8R4QIcQ_ZsRqOAbeRfcZhilN_MksRtDaErMA')
'qL8R4QIcQ/ZsRqOAbeRfcZhilN/MksRtDaErMA=='
```

---


### base64url.toBuffer(input: string): Buffer

Convert a base64url encoded string to a Buffer containing the decoded bytes.

```js
> base64url.toBuffer('c3Bpcml0dWFsaXplZA')
<Buffer 73 70 69 72 69 74 75 61 6c 69 7a 65 64>
```

# Alternatives

- [base64-url](https://github.com/joaquimserafim/base64-url)

# 中文说明

本库实现 [RFC 4648](http://en.wikipedia.org/wiki/Base64#RFC_4648) 定义的 base64url 编解码，零运行时依赖：

- 字母表：标准 base64 为 `A-Za-z0-9+/`；base64url 为 `A-Za-z0-9-_`，且省略填充符 `=`。
- 填充规则：还原为标准 base64 时，按长度对 4 取模补 `=`，补足个数为 `4 - (len % 4)`（余 1 补 3、余 2 补 2、余 3 补 1）。

## API

- `base64url(input, encoding = "utf8")` / `base64url.encode(input, encoding = "utf8")`：默认调用即 `encode`。`string` 按 `encoding` 转 `Buffer`，`Buffer` 直接使用；内部走 `toString("base64")` 再做 URL-safe 转换，因此可安全处理 JPEG 等二进制数据。输入必须是 `string` 或 `Buffer`，否则抛出 `TypeError: Expected input to be a string or Buffer`。
- `base64url.decode(base64url, encoding = "utf8")`：先还原字母表与填充，再按 base64 解码，最后按 `encoding` 输出字符串；传入 `Buffer` 会先 `.toString()` 再处理。
- `base64url.toBase64(input)`：base64url → 标准 base64，即 `-`→`+`、`_`→`/` 并补齐 `=`。
- `base64url.fromBase64(input)`：标准 base64 → base64url，即 `+`→`-`、`/`→`_` 并剥除所有 `=`。
- `base64url.toBuffer(input)`：base64url → `Buffer`，字节内容与 `decode` 的解码结果一致。

合法输入满足 `decode(encode(x)) === x` 与 `toBuffer(encode(buf))` 字节级 round-trip。

## 测试

保持零依赖，测试 harness 为 `npm test`（`clean` + `tsc` + `tap`）。最近一次真实运行结果：10 个测试用例、50 个断言全部通过，0 失败。

# Supported Node.js versions

This library should be used with current versions of the Node.js runtime's long-term stable (LTS)
schedule. More information can be found [at the Node.js Release Working Group](https://github.com/nodejs/Release) repo.

# License

MIT

```
Copyright (c) 2013–2016 Brian J. Brennan

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
