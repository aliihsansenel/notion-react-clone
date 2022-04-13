import React, { useRef, useState, useEffect, useContext } from 'react';

import { keyDownEnter, keyDownArrow } from "util/editor/keyboard";

import { NoteContext } from './NoteEditor';

function NoteTitle({ handlers }) {

    const [notes, setNotes] = useContext(NoteContext);
    const activeBlock = notes.activeBlock;
    
    let elementRef = useRef();

    function focusHandler(event) {
        if (activeBlock.blockId !== 0) {
            handlers.navHandler(0, 'self');
        }
    }
    function keyDownHandler(event) {
        const element = elementRef.current;
        let payload = null;
        let dir = null;
        switch (event.key) {
            case 'Enter':
                payload = keyDownEnter(element, event);           
                handlers.newRowHandler(0, payload);                    break;
            case 'ArrowRight':
                dir = keyDownArrow(element, 'next');
                if (dir === null) break;
                handlers.navHandler(0, dir);                           break;
            default: break;
        }
    }
    useEffect(() => {
        if (activeBlock.blockId === 0 && activeBlock.selfFocus === false) {
            const element = elementRef.current;
            element.focus();
            const range = document.createRange();
            range.selectNodeContents(element);
            const payload = activeBlock.payload;
            if (payload !== null) {
                range.collapse(false);
                range.insertNode(payload);
                range.collapse(true);
            } else {
                range.collapse(false);
                
            }
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }, [activeBlock.blockId]);
    return (
        <h1 className='note-title' name="note-title"
            contentEditable="true"
            ref={elementRef}
            onFocus={focusHandler}
            onKeyDown={keyDownHandler}
            data-placeholder="Untitled"
            suppressContentEditableWarning
        >

        </h1>
    )
}

export default NoteTitle