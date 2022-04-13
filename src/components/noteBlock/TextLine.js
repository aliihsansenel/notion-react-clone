import React, { useRef, useState, useEffect, useContext } from 'react';

import { keyDownEnter, keyDownTab, keyDownBackspace, keyDownArrow } from "util/editor/keyboard";


function TextLine({ html, placeholder, hasFocus, activeBlock, handlers }) {
    // const [html, setHtml] = useState(initialHtml);
    const elementRef = useRef();
    
    function focusHandler(event) {
    }
    function keyDownHandler(event) {
        const element = elementRef.current;
        let payload = null;
        let dir = null;

        switch (event.key) {
            case 'Enter':
                payload = keyDownEnter(element, event);
                handlers.newLineHandler(payload);                   break;
            case 'Backspace':
                payload = keyDownBackspace(element, event);
                if (payload === false) break;
                handlers.deleteHandler(payload, 'prev');            break;
            case 'Tab':
                dir = keyDownTab(element, event);
                if (dir === null) break;
                handlers.blurHandler(elementRef.current.innerHTML);
                handlers.indendationHandler(dir);                   break;
            case 'ArrowLeft':
                dir = keyDownArrow(element, 'prev');
                if (dir === null) break;
                handlers.navHandler(dir);                           break;
            case 'ArrowRight':
                dir = keyDownArrow(element, 'prev');
                if (dir === null) break;
                handlers.navHandler(dir);                           break;
            default: break;
        }
    }
    function blurHandler() {
        handlers.blurHandler(elementRef.current.innerHTML);
    }
    useEffect(() => {
        const element = elementRef.current;
        if (!hasFocus) return;

        element.focus();

        const range = document.createRange();
        range.selectNodeContents(element);
        const payload = activeBlock.payload;

        if (payload !== null) {
            
            if (activeBlock.pos === true) {
                range.collapse(true);
                range.insertNode(payload);
                range.collapse(true);
            } else {
                range.collapse(false);
                range.insertNode(payload);
                range.collapse(true);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else {
            range.collapse(activeBlock.pos);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }, [hasFocus]);

    return (
        <p className="text-line"
            data-placeholder={placeholder}
            contentEditable
            ref={elementRef}

            onFocus={focusHandler}
            onKeyDown={keyDownHandler}
            onBlur={blurHandler}

            dangerouslySetInnerHTML={{__html: html}}
            suppressContentEditableWarning
        />
    )
}

export default TextLine;