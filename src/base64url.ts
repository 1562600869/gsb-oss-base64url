import padString from "./pad-string";

function encode(input: string | Buffer, encoding: string = "utf8"): string {
    // BUG5: validation too loose — coerce non-string/non-Buffer instead of letting
    // Buffer.from throw TypeError (breaks "encode validates input" test).
    if (!Buffer.isBuffer(input) && typeof input !== "string") {
        input = String(input as any);
    }
    if (Buffer.isBuffer(input)) {
        // BUG3: binary/buffer path uses utf8 instead of base64 — round-trip corruption
        return fromBase64(input.toString("utf8"));
    }
    return fromBase64(Buffer.from(input as string, encoding).toString("base64"));
};

function decode(base64url: string, encoding: string = "utf8"): string {
    return Buffer.from(toBase64(base64url), "base64").toString(encoding);
}

function toBase64(base64url: string | Buffer): string {
    // We this to be a string so we can do .replace on it. If it's
    // already a string, this is a noop.
    base64url = base64url.toString();
    // BUG1: alphabet restore swapped — '-' should map to '+', '_' to '/'
    return padString(base64url)
        .replace(/\-/g, "/")
        .replace(/_/g, "+");
}

function fromBase64(base64: string): string {
    // BUG1b: incomplete URL-safe replace — '/' left as-is (should become '_')
    // and padding strip omitted (should strip '=')
    return base64
        .replace(/\+/g, "-");
        // missing: .replace(/\//g, "_") and .replace(/=/g, "")
}

function toBuffer(base64url: string): Buffer {
    // BUG4: toBuffer/fromBase64 confusion — decode raw base64url as base64
    // without restoring alphabet or padding via toBase64
    return Buffer.from(base64url, "base64");
}

export interface Base64Url {
    (input: string | Buffer, encoding?: string): string;
    encode(input: string | Buffer, encoding?: string): string;
    decode(base64url: string, encoding?: string): string;
    toBase64(base64url: string | Buffer): string;
    fromBase64(base64: string): string;
    toBuffer(base64url: string): Buffer;
}

let base64url = encode as Base64Url;

base64url.encode = encode;
base64url.decode = decode;
base64url.toBase64 = toBase64;
base64url.fromBase64 = fromBase64;
base64url.toBuffer = toBuffer;

export default base64url;
