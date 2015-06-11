export default function ElementList(array) {
    array = array.concat();
    Object.freeze(array);
    return array;
}
