import React, { useRef, useState, useEffect, useContext } from 'react';

import { NoteContext } from './NoteEditor';
import BlockSelector, { getNoteBlockStyle } from 'components/noteBlock/BlockSelector';
import { addBlockAfter, blockSelfFocus } from 'actions/editorActions';

function NoteBlock({ id }) {

    const { noteState, handlers} = useContext(NoteContext);
    const [notes, setNotes] = noteState;

    const block = notes.blocks[id];
    const content = notes.blockContents[id];

    const activeBlock = notes.activeBlock;
    let elementRef = useRef();

    function blurHandler(html) {
        handlers.blurHandler(id, html);
    }

    function focusHandler(event) {
        if (activeBlock.blockId === id) return;
        if (event.target.closest('.note-block') !== elementRef.current) return;
        setNotes((notes) => { return blockSelfFocus(notes, id) });
    }
    function navHandler(dir) {
        handlers.navHandler(id, dir);
    }
    function newLineHandler(payload) {
        if (activeBlock.blockId !== id) return;
        handlers.newLineHandler(id, payload);
    }
    function indentationHandler(dir) {
        handlers.indentationHandler(id, dir);
    }
    function deleteHandler(payload, dir) {
        handlers.deleteHandler(id, payload, dir);
    }
    
    let blockStyle = { marginLeft: `${block.level * 1.5}em` };
    Object.assign(blockStyle, getNoteBlockStyle(block.type));
    const localHandlers = { blurHandler, focusHandler, navHandler, newLineHandler, indentationHandler, deleteHandler };
    return (
        <div className='note-block' ref={elementRef} onFocus={focusHandler} style={blockStyle} >
            <BlockSelector 
                type={block.type}
                hasFocus={activeBlock.blockId === id && activeBlock.selfFocus === false}
                activeBlock={(activeBlock.blockId === id && notes.activeBlock) ? notes.activeBlock: null}
                block={block}
                html={content}
                handlers={localHandlers} />
        </div>
    )
}

export default NoteBlock;