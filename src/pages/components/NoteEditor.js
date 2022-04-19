import React, { useState, useRef, useEffect, createContext } from 'react';

import NoteTitle from './NoteTitle';
import NoteBlock from './NoteBlock';

import { registerContent, addBlockAfter, blockSelfFocus, indentBlock, unindentBlock, deleteBackward, adjacentSiblings } from 'actions/editorActions';

export const NoteContext = createContext();

const initialBlocks = {
    1: {
        id: 1,
        type: 'plain',
        level: 0,
    },
    2: {
        id: 2,
        type: 'plain',
        level: 1,
    },
    3: {
        id: 3,
        type: 'plain',
        level: 0,
    }
};


function NoteEditor() {
    const [notes, setNotes] = useState({
        title: '',
        blocks: {...initialBlocks},
        blockContents: { 1: '', 2: '', 3: ''},
        bodyBlocks: [ 1, 2, 3 ],
        activeBlock: {
            blockId: 1, selfFocus: false, pos: true, payload: null,
        },
        blockIdCounter: 3
    });
    function blurHandler(blockId, html) {
        setNotes((notes) => {
            return registerContent(notes, blockId, html);
        });
    }
    function navHandler(blockId, dir) {

        if(dir === 'self')
            setNotes((notes) => { return blockSelfFocus(notes, blockId)});
    }
    function newLineHandler(blockId, payload) {
        setNotes((notes) => {
            return addBlockAfter(notes, blockId, payload);
        });
    }
    function indentationHandler(blockId, dir){
        if (dir === 'end')
            setNotes((notes) => { return indentBlock(notes, blockId)});
        else
            setNotes((notes) => { return unindentBlock(notes, blockId)});
    }
    function deleteHandler(blockId, payload, dir) {
        if (dir === 'prev' && notes.bodyBlocks[1] !== blockId) {
            setNotes((notes) => { return deleteBackward(notes, blockId, payload)});
        }
    }
    const handlers = { blurHandler, navHandler, newLineHandler, indentationHandler, deleteHandler };
    return (
        <NoteContext.Provider value={{ noteState: [notes, setNotes], handlers }}>
            <div className='note-editor'>
                <NoteTitle />
                {
                    notes.bodyBlocks.map((blockId) => {
                        return <NoteBlock id={blockId} key={blockId} />;
                    })
                }
            </div>
        </NoteContext.Provider>
    )
}

export default NoteEditor;