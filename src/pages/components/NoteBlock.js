import React, { useRef, useState, useEffect, useContext } from 'react';

import TextLine from 'components/noteBlock/TextLine';

import { NoteContext } from './NoteEditor';
import BlockSelector from 'components/noteBlock/BlockSelector';
import { addBlock, blockSelfFocus } from 'actions/editorActions';

function NoteBlock({ id, handlers }) {

    const [notes, setNotes] = useContext(NoteContext);
    const block = notes.blocks.byId[id];

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
    function indendationHandler(dir) {
        handlers.indendationHandler(id, dir);
    }
    function deleteHandler(payload, dir) {
        handlers.deleteHandler(id, payload, dir);
    }
    

    return (
        <div className='note-block' ref={elementRef} onFocus={focusHandler}>
            <BlockSelector 
                type={block.type}
                hasFocus={activeBlock.blockId === id && activeBlock.selfFocus === false}
                activeBlock={activeBlock.blockId === id && notes.activeBlock ? notes.activeBlock: null}
                html={block.html}
                handlers={{ blurHandler, focusHandler, navHandler, newLineHandler, indendationHandler, deleteHandler }} />
            { block.children?.length > 0 && 
                (<div className='child-block'>
                    {
                        block.children.map((blockId) => {
                        return <NoteBlock key={blockId}
                            parentId={id}
                            id={blockId}
                            handlers={handlers}
                             />})
                    }
                </div>)
            }
        </div>
    )
}

export default NoteBlock;