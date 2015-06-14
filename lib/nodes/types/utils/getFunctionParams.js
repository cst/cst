export default function getFunctionParams(children) {
    let params = [];
    children.passToken('Punctuator', '(');
    children.skipNonCode();
    if (!children.isToken('Punctuator', ')')) {
        params.push(children.passPattern());
        children.skipNonCode();
        while (!children.isToken('Punctuator', ')')) {
            children.passToken('Punctuator', ',');
            children.skipNonCode();
            params.push(children.passPattern());
            children.skipNonCode();
        }
    }
    children.passToken('Punctuator', ')');
    return params;
}
