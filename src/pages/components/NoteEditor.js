import React, { useState, useRef, useEffect, createContext } from 'react';

import NoteTitle from './NoteTitle';
import NoteBlock from './NoteBlock';

import { registerContent, addSameBlockAfter, addBlockAfter, blockSelfFocus, indentBlock, unindentBlock, turnBlockInto, deleteBackward, adjacentSiblings, focusPreviousBlock, focusNextBlock, removePickerText } from 'actions/editorActions';
import BlockPicker from '../../components/nodeEditor/BlockPicker';
import { isContentEmpty } from 'util/editor/text';

export const NoteContext = createContext();

const initialBlocks = {
    0: {
        id: 0,
        type: 'title',
        level: 0,
    },
    1: {
        id: 1,
        type: 'text',
        level: 0,
    },
    2: {
        id: 2,
        type: 'h1',
        level: 0,
    },
    3: {
        id: 3,
        type: 'todo',
        level: 0,
        checked: true
    },
    4: {
        id: 4,
        type: 'todo',
        level: 1,
    }
};


function NoteEditor() {
    const [notes, setNotes] = useState({
        blocks: {...initialBlocks},
        blockContents: { 0: '', 1: 'Simple text', 2: 'Heading 1', 3: 'Add todo and  heading blocks', 4: 'Comment the code!'},
        bodyBlocks: [ 0, 1, 2, 3, 4 ],
        activeBlock: {
            blockId: 1, selfFocus: false, pos: true, payload: null,
        },
        blockIdCounter: 4
    });
    const [picker, setPicker] = useState({show: false, text: null, box: null, no: 0});

    const pickerKeyDownHandler = useRef();

    // TODO comment
    function closeBlockPicker() {
        if(picker.show)
            setPicker((picker) =>  {
                return {show: false, text: null, box: null, no: picker.no + 1}
            });
    }
    function updatePickerText(content) {
        setPicker((picker) => { return {...picker, text: content }});
    }

    // TODO comments handlers
    function registrationHandler(blockId, html) {
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
            return addSameBlockAfter(notes, blockId, payload);
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
    function typeSelectHandler(type) {
        closeBlockPicker();
        setNotes((notes) => {
            const blockId = notes.activeBlock.blockId;
            if (picker.isBlockEmpty) {
                notes = turnBlockInto(notes, blockId, type);
                notes = removePickerText(notes, blockId, picker.no);
                return notes;
            } else {
                notes = removePickerText(notes, blockId, picker.no);
                notes = addBlockAfter(notes, blockId, null, type);
                return notes = turnBlockInto(notes, notes.activeBlock.blockId, type);
            }
        });
    }
    const handlers = { registrationHandler, navHandler, newLineHandler, indentationHandler, deleteHandler, pickerKeyDownHandler };

    useEffect(() => {
        closeBlockPicker();
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
            { picker.show && <BlockPicker text={picker.text} box={picker.box} 
                handlers={[typeSelectHandler, pickerKeyDownHandler ]} /> }
            </div>
        </NoteContext.Provider>
    )
}

export default NoteEditor;