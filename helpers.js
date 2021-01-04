function createNode(node, attributes) {
    var el = document.createElement(node);
    for (var key in attributes) {
        el.setAttribute(key, attributes[key]);
    }
    return el;
}
export { createNode };
