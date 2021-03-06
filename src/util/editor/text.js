export function isCaretAtStart(element) {
    const sel = window.getSelection();

    if(sel.isCollapsed === false) return false;
    let node = sel.anchorNode;
    
    if(node.tagName === 'P' && sel.anchorOffset === 1 && node.textContent.length === 0) return true;
    if (node.textContent !== '' && sel.anchorOffset !== 0) return false;
    
    while (element !== node) {
        if(node.previousSibling !== null) return false;
        node = node.parentNode;
    }
    return true;
}

export function isCaretAtEnd(element) {
    const sel = window.getSelection();
    if(sel.isCollapsed === false) return false;
    let node = sel.anchorNode;
    
    if(node.tagName === 'P' && sel.anchorOffset === 1) return true;
    if (node.textContent !== 0 && node.textContent.length !== sel.anchorOffset) return false;
    while (element !== node) {
        if(node.nextSibling !== null) return false;
        node = node.parentNode;
    }
    return true;
}

export function setCaret(element, pos) {
    const textNode = element.childNodes[0];
    if (!textNode) return;

    let range = document.createRange();
    let sel = window.getSelection();

    if (pos > 0) {
        range.setStart(textNode, 0);
        range.setEnd(textNode, pos);
        range.collapse(false);
    } else {
        range.selectNodeContents(textNode);
        range.collapse(pos ? false : true);
    }
    sel.removeAllRanges();
    sel.addRange(range);
}

export function isContentEmpty(strHTML) {
    var content = elementFromString(strHTML).textContent;
    return !content || content === '';
}

export function fragmentFromString(strHTML) {
    var temp = document.createElement('template');
    temp.innerHTML = strHTML;
    return temp.content;
}
export function elementFromString(strHTML) {
    var temp = document.createElement('template');
    temp.innerHTML = strHTML;
    return temp;
}

