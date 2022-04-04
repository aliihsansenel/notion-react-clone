import React, { useState, useRef } from 'react'

import { keyDownEnter, keyDownBackspace, keyDownArrow } from "util/editor/keyboard";


function TextLine({ placeholder, handlers }) {
    const [html, setHtml] = useState('');
    const elementRef = useRef();
    
    function focusHandler(event) {
        // handlers.focusHandler();
    }
    function keyDownHandler(event) {
        const element = elementRef.current;
        let payload = null;
        let dir = null;
        switch (event.key) {
            case 'Enter':
                payload = keyDownEnter(element, event);           
                handlers.newRowHandler(payload);                    break;
            case 'Backspace':
                payload = keyDownBackspace(element, event);
                if (payload === false) break;
                handlers.deleteRowHandler(payload, 'up');           break;
            case 'ArrowLeft':
                dir = keyDownArrow(element, 'left');
                if (dir === null) break;
                handlers.navHandler(dir);                           break;
            case 'ArrowRight':
                dir = keyDownArrow(element, 'right');
                if (dir === null) break;
                handlers.navHandler(dir);                           break;
            default: break;
        }
    }
    function changeHandler() {
        setHtml(() => {
            return elementRef.current.innerHTML;
        });
    }
    return (
        <p className="text-line"
            data-placeholder={placeholder}
            contentEditable
            ref={elementRef}

            onFocus={focusHandler}
            onKeyDown={keyDownHandler}
            onBlur={changeHandler}

            dangerouslySetInnerHTML={{__html: html}}
            suppressContentEditableWarning
        />
    )
}

export default TextLine;