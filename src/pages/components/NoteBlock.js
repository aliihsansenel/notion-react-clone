import React, { useRef, useState, useEffect, useContext } from 'react';

import TextLine from 'components/noteBlock/TextLine';

import { NoteContext } from './NoteEditor';
import BlockSelector from 'components/noteBlock/BlockSelector';
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
        console.log('blockId', id);
        handlers.newLineHandler(id, payload);
    }
    function indentationHandler(dir) {
        handlers.indentationHandler(id, dir);
    }
    function deleteHandler(payload, dir) {
        handlers.deleteHandler(id, payload, dir);
    }
    
    const localHandlers = { blurHandler, focusHandler, navHandler, newLineHandler, indentationHandler, deleteHandler };
    return (
        <div className='note-block' ref={elementRef} onFocus={focusHandler} style={{marginLeft: `${block.level * 2}em`}}>
            <BlockSelector 
                type={block.type}
                hasFocus={activeBlock.blockId === id && activeBlock.selfFocus === false}
                activeBlock={(activeBlock.blockId === id && notes.activeBlock) ? notes.activeBlock: null}
                html={content}
                handlers={localHandlers} />
        </div>
    )
}

export default NoteBlock;