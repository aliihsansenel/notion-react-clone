import React, { useState, useRef, useEffect, createContext } from 'react';

import NoteTitle from './NoteTitle';
import NoteBlock from './NoteBlock';

import { registerHTML, addBlock, blockSelfFocus, moveBlock, deleteBackward, adjacentSiblings } from 'actions/editorActions';

export const NoteContext = createContext();

const initialBlocks = {
    byId: {
        0: {
            id: 0,
            type: 'title',
            html: '',
            parentId: null,
            children: []
        },
        1: {
            id: 1,
            type: 'plain',
            html: '',
            parentId: null,
            children: [2]
        },
        2: {
            id: 2,
            type:
            'plain', 
            html: '',
            parentId: 1,
            children: []
        },
        3: {
            id: 3,
            type: 'plain',
            html: '',
            parentId: null,
            children: []
        }
    },
    allIds: []
};

function NoteEditor() {
    const [notes, setNotes] = useState({
        blocks: {...initialBlocks},
        bodyBlocks: [0, 1, 3],
        activeBlock: {
            blockId: 1, selfFocus: false, pos: true, payload: null,
        },
        blockIdCounter: 3
    });
    function blurHandler(blockId, html) {
        setNotes((notes) => {
            return registerHTML(notes, blockId, html);
        });
    }
    function navHandler(blockId, dir) {

        if(dir === 'self')
            setNotes((notes) => { return blockSelfFocus(notes, blockId)});
    }
    function newLineHandler(blockId, payload) {
        setNotes((notes) => {
            return addBlock(notes, blockId, payload);
        });
    }
    function indendationHandler(blockId, dir){
        if (dir === 'end') {
            const prevSibling = adjacentSiblings(notes, blockId).previousSibling;

            if (prevSibling === null || prevSibling.id === 0) return;
            
            setNotes((notes) => { return moveBlock(notes, blockId, prevSibling.id, -1)});
        }
    }
    function deleteHandler(blockId, payload, dir) {
        if (dir === 'prev' && notes.bodyBlocks[1] !== blockId) {
            setNotes((notes) => { return deleteBackward(notes, blockId, payload)});
        }
    }
    
    return (
        <NoteContext.Provider value={[notes, setNotes]}>
            <div className='note-editor'>
                <NoteTitle
                    handlers={{navHandler, deleteHandler }}
                />
                {
                    notes.bodyBlocks.slice(1).map((blockId) => {
                        return <NoteBlock key={blockId}
                            parentId={null}
                            id={blockId}
                            handlers={{blurHandler, navHandler, newLineHandler, indendationHandler, deleteHandler }} />
                    })
                }
            </div>
        </NoteContext.Provider>
    )
}

export default NoteEditor;