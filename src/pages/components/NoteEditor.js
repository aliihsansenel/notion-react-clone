import React, { useState, useRef, useEffect, createContext } from 'react';

import NoteTitle from './NoteTitle';
import NoteBlock from './NoteBlock';

import { registerContent, addBlockAfter, blockSelfFocus, indentBlock, unindentBlock, deleteBackward, adjacentSiblings, focusPreviousBlock, focusNextBlock } from 'actions/editorActions';
import BlockPicker from '../../components/nodeEditor/BlockPicker';

export const NoteContext = createContext();

const initialBlocks = {
    0: {
        id: 0,
        type: 'title',
        level: 0,
    },
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
        blocks: {...initialBlocks},
        blockContents: { 0: '', 1: '', 2: '', 3: ''},
        bodyBlocks: [ 0, 1, 2, 3 ],
        activeBlock: {
            blockId: 1, selfFocus: false, pos: true, payload: null,
        },
        blockIdCounter: 3
    });
    const [picker, setPicker] = useState({show: false, text: null, box: null, no: 0});

    // TODO comment
    function closeBlockPicker() {
        setPicker((picker) =>  { 
            if(!picker.show)
                return picker;
            return {show: false, text: null, box: null, no: picker.no + 1}});
    }
    function updatePickerText(content) {
        setPicker((picker) => { return {...picker, text: content }});
    }

    // TODO comments handlers
    function blurHandler(blockId, html) {
        setNotes((notes) => {
            return registerContent(notes, blockId, html);
        });
    }
    function navHandler(blockId, dir) {
        if(dir === 'self')
            setNotes((notes) => { return blockSelfFocus(notes, blockId)});
        else if (dir === 'prev')
            setNotes((notes) => { return focusPreviousBlock(notes, blockId)});
        else if (dir === 'next')
            setNotes((notes) => { return focusNextBlock(notes, blockId)});
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
        if (dir === 'prev' && notes.bodyBlocks[0] !== blockId) {
            setNotes((notes) => { return deleteBackward(notes, blockId, payload)});
        }
    }
    const handlers = { blurHandler, navHandler, newLineHandler, indentationHandler, deleteHandler };

    useEffect(() => {
        closeBlockPicker();
        // console.info("notes.activeBlock.blockId");


    }, [notes.activeBlock.blockId]);
    
    return (
        <NoteContext.Provider value={{ 
                noteState: [notes, setNotes], 
                pickerState: [picker, setPicker], 
                handlers 
            }}>
            <div className='note-editor' >
                <NoteTitle />
                {
                    notes.bodyBlocks.slice(1).map((blockId) => {
                        return <NoteBlock id={blockId} key={blockId} />;
                    })
                }
            { picker.show && <BlockPicker text={picker.text} box={picker.box}/> }
            </div>
        </NoteContext.Provider>
    )
}

export default NoteEditor;