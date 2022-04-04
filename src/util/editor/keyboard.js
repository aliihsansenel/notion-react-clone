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

export function keyDownBackspace(element, event) {

    if (isCaretAtStart(element)) {

        event.preventDefault();
        const range = document.createRange();
        range.selectNodeContents(element);
        const content = range.extractContents();
        if (content.textContent === '') return null;
        return content;
    }
    return false;
}


export function keyDownArrow(element, dir) {
    
    if(dir === 'left' && isCaretAtStart(element)) {
        return dir;
    } else if (dir === 'right' && isCaretAtEnd(element)) {
        return dir;
    }
    return null;
}