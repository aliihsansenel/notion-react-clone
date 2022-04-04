import TextLine from 'components/noteBlock/TextLine';
import React, { useRef, useState, useEffect } from 'react';


function NoteBlock({ id, activeBlock, handlers }) {

    let elementRef = useRef();

    function focusHandler(event) {
        if (activeBlock.blockId !== id) {
            handlers.navHandler(id, 'self');
        }
    }
    function navHandler(dir) {
        dir = dir === 'left' ? 'up' : dir === 'right' ? 'down' : 'self';
        handlers.navHandler(id, dir);
    }
    function newRowHandler(payload) {
        handlers.newRowHandler(id, payload);
    }
    function deleteRowHandler(payload, dir) {
        handlers.deleteRowHandler(id, payload, dir);
    }
    useEffect(() => {
        if (activeBlock.blockId === id && activeBlock.selfFocus === false) {
            const element = elementRef.current;
            const textElement = element.querySelector('.text-line');
            textElement.focus();
            const range = document.createRange();
            range.selectNodeContents(textElement);
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
        }
    }, [activeBlock.blockId]);

    return (
        <pre className='note-block' ref={elementRef} onFocus={focusHandler}>
            <TextLine clasName='text-line'
                placeholder={"Type '/' for commands"}
                handlers={{focusHandler, navHandler, newRowHandler, deleteRowHandler}}
            />
        </pre>
    )
}

export default NoteBlock;