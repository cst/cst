export default function acceptArgumentList(children) {
    let args = [];
    children.skipNonCode();

    children.passToken('Punctuator', '(');
    children.skipNonCode();

    while (!children.isToken('Punctuator', ')')) {
        if (children.isToken('Punctuator', ',')) {
            children.moveNext();
            children.skipNonCode();
            children.assertToken('Punctuator', ')');
        } else {
            args.push(children.passExpressionOrSpreadElement());
            children.skipNonCode();
            if (children.isToken('Punctuator', ',')) {
                children.moveNext();
                children.skipNonCode();
            }
        }
    }

    children.passToken('Punctuator', ')');
    children.assertEnd();

    return args;
}
