import React, { useState, useRef, useEffect } from 'react';

import NoteTitle from './NoteTitle';
import NoteBlock from './NoteBlock';

function NoteEditor() {
    const [notes, setNotes] = useState({
        bodyBlocks: [0, 1, 2],
        activeBlock: {
            blockId: 1, selfFocus: false, pos: true, payload: null,
        }
    });

    const blockIdCounter = useRef(3);

    function navHandler(blockId, dir) {
        dir = dir === 'self' ? 0 : dir === 'up' ? -1 : 1;
        setNotes((notes) => {
            const bodyBlocks = [...notes.bodyBlocks];
            const activeBlock = { ...notes.activeBlock };

            const index = bodyBlocks.indexOf(blockId);

            let targetBlockIndex = index + dir;
            if (targetBlockIndex < 0 || targetBlockIndex > bodyBlocks.length - 1 || activeBlock.blockId === bodyBlocks[targetBlockIndex])
                return { ...notes, bodyBlocks, 'activeBlock': {...activeBlock, payload: null } };
            
                const selfFocus = dir ? false : true;
            let pos = false;
            if (dir >= 1) {
                pos = true;
            }
            return { ...notes, bodyBlocks, 'activeBlock': {...activeBlock, blockId: bodyBlocks[targetBlockIndex], selfFocus, pos, payload: null } };
        });
    }
    function deleteRowHandler(blockId, payload, dir) {
        setNotes((notes) => {
            const bodyBlocks = [...notes.bodyBlocks];
            const activeBlock = { ...notes.activeBlock };

            const index = bodyBlocks.indexOf(blockId);
            let targetBlockIndex = dir === 'up' ? index - 1 : index;
            if (targetBlockIndex < 0)
                return { ...notes, bodyBlocks, 'activeBlock': {...activeBlock, blockId: bodyBlocks[0], selfFocus: false, pos: true, payload: null } };
            
            let pos = false;
            if (dir === 'up') {
                bodyBlocks.splice(index, 1);
            }
            else if (dir === 'down' && bodyBlocks[index + 1]) {
                bodyBlocks.splice(index + 1, 1);
            }
            return { ...notes, bodyBlocks, 'activeBlock': {...activeBlock, blockId: bodyBlocks[targetBlockIndex], selfFocus: false, pos, payload } };
        });
    }
    function newRowHandler(blockId, payload) {
        setNotes((notes) => {
            const bodyBlocks = [...notes.bodyBlocks];
            const activeBlock = { ...notes.activeBlock };

            const index = bodyBlocks.indexOf(blockId);

            bodyBlocks.splice(index + 1, 0, blockIdCounter.current++);
            return { ...notes, bodyBlocks, 'activeBlock': {...activeBlock, blockId: bodyBlocks[index + 1], selfFocus: false, pos:true, payload } };
        });
    }
    return (
        <div  className='note-editor'  >
            <NoteTitle activeBlock={notes.activeBlock} handlers={{navHandler, deleteRowHandler, newRowHandler}}/>
            {
                notes.bodyBlocks.slice(1).map((blockId) => {
                    return <NoteBlock key={blockId} id={blockId} activeBlock={notes.activeBlock} handlers={{navHandler, deleteRowHandler, newRowHandler}} />
                })
            }
        </div>
    )
}

export default NoteEditor;