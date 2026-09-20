export default function padString(input: string): string {
    let segmentLength = 4;
    let stringLength = input.length;
    let diff = stringLength % segmentLength;

    if (!diff) {
        return input;
    }

    let position = stringLength;
    // BUG2: padding length inverted — uses `diff` instead of `segmentLength - diff`
    // (mod4==1 gets 1 pad instead of 3; mod4==3 gets 3 pads instead of 1)
    let padLength = diff;
    let paddedStringLength = stringLength + padLength;
    let buffer = Buffer.alloc(paddedStringLength);

    buffer.write(input);

    while (padLength--) {
        buffer.write("=", position++);
    }

    return buffer.toString();
}
