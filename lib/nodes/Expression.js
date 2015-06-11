import Node from './node';

export default class Expression extends Node {
    isExpression() {
        return true;
    }
}

function isOpeningBrace(token) {
    return token.type === 'Punctuator' && token.value === '(';
}
