import { isCaretAtStart, isCaretAtEnd } from "./text";

export function keyDownEnter(element, event) {
    event.preventDefault();

    const selRange = window.getSelection().getRangeAt(0);
    const range = document.createRange();
    
    range.selectNodeContents(element);
    range.setStart(selRange.endContainer, selRange.endOffset);
    let content = range.extractContents();
    selRange.deleteContents();
    return content;
}

export function keyDownTab(element, event) {
    event.preventDefault();
    if (event.shiftKey) return 'start';
    return 'end';
}

export function keyDownBackspace(element, event) {
    if (isCaretAtStart(element)) {
        event.preventDefault();
        const range = document.createRange();
        range.selectNodeContents(element);
        const content = range.cloneContents();
        if (content.textContent === '') return null;
        return content;
    }
    return false;
}

export function keyDownArrow(element, dir) {
    if ((dir === 'prev' && isCaretAtStart(element)) || ((dir === 'next' && isCaretAtEnd(element)))) {
        return dir;
    }
    return null;
}

export function keyDownSlash(event, no) {
    event.preventDefault();
    let span = document.createElement('span');
    span.classList.add('picker-text');
    span.setAttribute('no', no);
    span.innerHTML = '/';

    const range = window.getSelection().getRangeAt(0);
    range.insertNode(span);
    range.collapse(false);
    return span;
}