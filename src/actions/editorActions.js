import { getDefaultBlock } from "components/noteBlock/blockDefaults";
import { elementFromString, fragmentFromString } from "util/editor/text";

// TODO comment
export function registerContent(notes, blockId, content) {
    return { ...notes,
        'blockContents': {...notes.blockContents,
            [blockId]: content
        },
        // 'activeBlock': {...notes.activeBlock,
        //     pos: true,
        //     payload: null, 
        // }
    };
}

// TODO comment
export function blockFocus(notes, blockId, pos) {
    const activeBlock = { ...notes.activeBlock };
    
    return { ...notes,
        'activeBlock': {...activeBlock,
            blockId,
            selfFocus: true,
            pos,
            payload: null 
    } };
}

// TODO comment
export function blockSelfFocus(notes, blockId) {
    const activeBlock = { ...notes.activeBlock };
        
    return { ...notes,
        'activeBlock': {...activeBlock,
            blockId,
            selfFocus: true,
            pos: null,
            payload: null 
    } };
}

// TODO comment
export function focusPreviousBlock(notes, blockId) {
    const prev = previousBlock(notes, blockId);
    if (prev === null) return notes;

    return { ...notes,
        'activeBlock': {...notes.activeBlock,
            blockId: prev.id,
            selfFocus: false,
            pos: false,
            payload: null 
    } };
}
// TODO comment
export function focusNextBlock(notes, blockId) {
    const next = nextBlock(notes, blockId);
    if (next === null) return notes;

    return { ...notes,
        'activeBlock': {...notes.activeBlock,
            blockId: next.id,
            selfFocus: false,
            pos: true,
            payload: null 
    } };
}

// TODO comment
export function addSameBlockAfter(notes, blockId, payload) {

    const blocks = {...notes.blocks};
    const bodyBlocks = [...notes.bodyBlocks];
    const blockContents = {...notes.blockContents};

    const index = bodyBlocks.indexOf(blockId);
    const newId = notes.blockIdCounter + 1;
    bodyBlocks.splice(index + 1, 0, newId);
    
    const thisBlock = blocks[blockId];
    const sameType = ['title', 'h1', 'h2', 'h3'].includes(thisBlock.type) ? 'text' : thisBlock.type;
    const newBlock = getDefaultBlock(sameType);
        newBlock.id = newId;
        newBlock.level = thisBlock.level;

    blocks[newId] = newBlock;
    blockContents[newId] = '';

    const activeBlock = {...notes.activeBlock};
    return  { ...notes, blocks, bodyBlocks, blockContents,
        'activeBlock': {...activeBlock,
            blockId: newId,
            selfFocus: false,
            pos: true,
            payload 
        },
        blockIdCounter: newId
    };
}

// TODO comment
export function addBlockAfter(notes, blockId, payload, type) {

    const blocks = {...notes.blocks};
    const bodyBlocks = [...notes.bodyBlocks];
    const blockContents = {...notes.blockContents};

    const index = bodyBlocks.indexOf(blockId);
    const newId = notes.blockIdCounter + 1;
    bodyBlocks.splice(index + 1, 0, newId);
    
    const thisBlock = blocks[blockId];
    const newBlock = getDefaultBlock(type);
        newBlock.id = newId;
        newBlock.level = thisBlock.level;

    blocks[newId] = newBlock;
    blockContents[newId] = '';

    const activeBlock = {...notes.activeBlock};
    return  { ...notes, blocks, bodyBlocks, blockContents,
        'activeBlock': {...activeBlock,
            blockId: newId,
            selfFocus: false,
            pos: true,
            payload 
        },
        blockIdCounter: newId
    };
}

// TODO comment
export function indentBlock(notes, blockId) {
    const blocks = {...notes.blocks};

    const prev = previousBlock(notes, blockId);
    if (prev.id === 0) return notes;
    
    const thisBlock = { ...blocks[blockId] };
    if(['h1', 'h2', 'h3'].includes(prev.type) && ['h1', 'h2', 'h3'].includes(thisBlock.type))
        return notes;

    let targetLevel = thisBlock.level + 1;
    if (targetLevel > prev.level + 1) targetLevel = prev.level + 1;
    if (targetLevel === thisBlock.level) return notes;

    thisBlock.level = targetLevel;
    return { ...notes, blocks: {...blocks, [blockId]: thisBlock }};
}

// TODO comment
export function unindentBlock(notes, blockId) {
    let blocks = {...notes.blocks};
    const thisBlock = { ...blocks[blockId] };

    let targetLevel = thisBlock.level - 1;
    if (targetLevel < 0) targetLevel = 0;
    if (targetLevel === thisBlock.level) return notes;

    let next = nextBlock(notes, blockId);
    while(next && next.level > thisBlock.level) {
        const newNext = { ...blocks[next.id] };
        newNext.level -= 1;
        blocks[next.id] = newNext;
        blocks = {...blocks, [next.id]: newNext };
        next = nextBlock(notes, next.id);
    }

    thisBlock.level = targetLevel;
    return { ...notes, blocks: {...blocks, [blockId]: thisBlock }};
}

export function removePickerText(notes, blockId, pickerNo) {
    const content = notes.blockContents[blockId];

    let temp = elementFromString(content);
    let fragment = temp.content;
    
    let e = fragment.querySelector(`.picker-text[no="${pickerNo}"]`);
    if (!e) return notes;
    e.parentNode.removeChild(e);
    return registerContent(notes, blockId, temp.innerHTML);
}

export function turnBlockInto(notes, blockId, type) {
    const blocks = {...notes.blocks};

    let block = { ...blocks[blockId] };
    block.type = type;

    return  { ...notes, blocks: {...blocks, [blockId]: block }};
}

// export function moveBlock(notes, blockId, targetBlockId, targetIndex) {
//     const blocks = {...notes.blocks};
//     const bodyBlocks = [...notes.bodyBlocks] ;
//     const blockContents = {...notes.blockContents};

//     const index = bodyBlocks.indexOf(blockId);
//     bodyBlocks.splice(index, 1);

//     const targetArray = targetBlockId === null ? notes.bodyBlocks: notes.blocks.byId[targetBlockId].children;
//     if (targetIndex < 0)
//         targetArray.push(blockId);
//     else
//         targetArray.splice(targetIndex, 0, blockId);
//     const thisBlock = notes.blocks.byId[blockId];
//     thisBlock.parentId = targetBlockId;
//     return { ...notes, 
//         'activeBlock': {...notes.activeBlock,
//             selfFocus: false,
//             payload: null,
//         }
//     };
// }

// TODO comment
export function deleteBackward(notes, blockId, payload) {
    const prev = previousBlock(notes, blockId);
    if (prev === null) return notes;
    
    const bodyBlocks = [...notes.bodyBlocks];
    const activeBlock = {...notes.activeBlock};
    
    const index = bodyBlocks.indexOf(blockId);
    bodyBlocks.splice(index, 1);

    return { ...notes, bodyBlocks,
        'activeBlock': {...activeBlock, 
            blockId: prev.id,
            selfFocus: false,
            pos: false,
            payload 
        }
    };
}

/* ______________________________________________________________________________________ */

// TODO comment.
export function previousBlock(notes, blockId) {
    const bodyBlocks = notes.bodyBlocks;

    const index = bodyBlocks.indexOf(blockId) - 1;

    if (index < 0) return null;
    return notes.blocks[bodyBlocks[index]];
}

// TODO comment.
export function nextBlock(notes, blockId) {
    const bodyBlocks = notes.bodyBlocks;

    const index = bodyBlocks.indexOf(blockId) + 1;

    if (index > bodyBlocks.length - 1) return null;
    return notes.blocks[bodyBlocks[index]];
}