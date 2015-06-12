import Expression from '../Expression';

export default class Literal extends Expression {
    constructor(childNodes) {
        super('Literal', childNodes);
    }

    _acceptChildren(children) {
        children.assertToken();
        let rawValue = children.currentElement.value;
        let value;
        switch (children.currentElement.type) {
            case 'Numeric':
                value = parseFloat(rawValue);
                break;
            case 'Boolean':
                value = rawValue === 'true';
                break;
            case 'Null':
                value = null;
                break;
            // TODO:
            //RegularExpression
            //String
        }
        children.moveNext();
        children.assertEnd();

        this._value = value;
        this._raw = rawValue;
    }

    get value() {
        return this._value;
    }

    get raw() {
        return this._raw;
    }
}

//function scanStringLiteral() {
//    var str = '', quote, start, ch, code, unescaped, restore, octal = false;
//
//    quote = source[index];
//    assert((quote === '\'' || quote === '"'),
//        'String literal must starts with a quote');
//
//    start = index;
//    ++index;
//
//    while (index < length) {
//        ch = source[index++];
//
//        if (ch === quote) {
//            quote = '';
//            break;
//        } else if (ch === '\\') {
//            ch = source[index++];
//            if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
//                switch (ch) {
//                    case 'n':
//                        str += '\n';
//                        break;
//                    case 'r':
//                        str += '\r';
//                        break;
//                    case 't':
//                        str += '\t';
//                        break;
//                    case 'u':
//                    case 'x':
//                        if (source[index] === '{') {
//                            ++index;
//                            str += scanUnicodeCodePointEscape();
//                        } else {
//                            restore = index;
//                            unescaped = scanHexEscape(ch);
//                            if (unescaped) {
//                                str += unescaped;
//                            } else {
//                                index = restore;
//                                str += ch;
//                            }
//                        }
//                        break;
//                    case 'b':
//                        str += '\b';
//                        break;
//                    case 'f':
//                        str += '\f';
//                        break;
//                    case 'v':
//                        str += '\x0B';
//                        break;
//
//                    default:
//                        if (isOctalDigit(ch)) {
//                            code = '01234567'.indexOf(ch);
//
//                            // \0 is not octal escape sequence
//                            if (code !== 0) {
//                                octal = true;
//                            }
//
//                            /* istanbul ignore else */
//                            if (index < length && isOctalDigit(source[index])) {
//                                octal = true;
//                                code = code * 8 + '01234567'.indexOf(source[index++]);
//
//                                // 3 digits are only allowed when string starts
//                                // with 0, 1, 2, 3
//                                if ('0123'.indexOf(ch) >= 0 &&
//                                    index < length &&
//                                    isOctalDigit(source[index])) {
//                                    code = code * 8 + '01234567'.indexOf(source[index++]);
//                                }
//                            }
//                            str += String.fromCharCode(code);
//                        } else {
//                            str += ch;
//                        }
//                        break;
//                }
//            } else {
//                ++lineNumber;
//                if (ch === '\r' && source[index] === '\n') {
//                    ++index;
//                }
//                lineStart = index;
//            }
//        } else if (isLineTerminator(ch.charCodeAt(0))) {
//            break;
//        } else {
//            str += ch;
//        }
//    }
//
//    if (quote !== '') {
//        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
//    }
//
//    return {
//        type: Token.StringLiteral,
//        value: str,
//        octal: octal,
//        lineNumber: lineNumber,
//        lineStart: lineStart,
//        range: [start, index]
//    };
//}
