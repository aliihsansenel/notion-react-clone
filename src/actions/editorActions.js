export function registerHTML(prevNotes, blockId, html) {
    const notes = JSON.parse(JSON.stringify(prevNotes));

    const thisBlock = notes.blocks.byId[blockId];
    thisBlock.html = html;
    
    notes.activeBlock.payload = null;
    return notes;
}
export function blockSelfFocus(notes, blockId) {
    const activeBlock = { ...notes.activeBlock };
    
    if ( activeBlock.blockId === blockId )
    return { ...notes,
        'activeBlock': {...activeBlock,
            payload: null
        } };
        
    const bodyBlocks = [...notes.bodyBlocks];
    return { ...notes, bodyBlocks,
        'activeBlock': {...activeBlock,
            blockId,
            selfFocus: true,
            pos: null,
            payload: null 
    } };
}
export function focusNextBlock(notes, blockId) {

    // return { ...notes, bodyBlocks,
    //     'activeBlock': {...activeBlock,
    //         blockId: bodyBlocks[targetBlockIndex],
    //         selfFocus: false,
    //         pos: true,
    //         payload: null 
    // } };
}
export function addBlock(prevNotes, blockId, payload) {
    const notes = JSON.parse(JSON.stringify(prevNotes));    
    const blocks = notes.blocks;

    const siblings = siblingsArray(notes, blockId);
    const index = siblings.indexOf(blockId);
    const newId = notes.blockIdCounter + 1;
    siblings.splice(index + 1, 0, newId);
    
    const thisBlock = blocks.byId[blockId];
    blocks.byId[newId] = {
        id: newId,
        type: thisBlock.type,
        html: '',
        parentId: thisBlock.parentId,
        children: []
    };
    
    const activeBlock = notes.activeBlock;
    return { ...notes, 
        'activeBlock': {...activeBlock, 
            blockId: newId,
            selfFocus: false,
            pos: true,
            payload 
        },
        blockIdCounter: newId
    };
}


export function moveBlock(prevNotes, blockId, targetBlockId, targetIndex) {
    const notes = JSON.parse(JSON.stringify(prevNotes));

    const siblings = siblingsArray(notes, blockId);
    const index = siblings.indexOf(blockId);
    siblings.splice(index, 1);

    const targetArray = targetBlockId === null ? notes.bodyBlocks: notes.blocks.byId[targetBlockId].children;
    if (targetIndex < 0)
        targetArray.push(blockId);
    else
        targetArray.splice(targetIndex, 0, blockId);
    const thisBlock = notes.blocks.byId[blockId];
    thisBlock.parentId = targetBlockId;
    return { ...notes, 
        'activeBlock': {...notes.activeBlock,
            selfFocus: false,
            payload: null,
        }
    };
}

export function deleteBackward(prevNotes, blockId, payload) {
    const notes = JSON.parse(JSON.stringify(prevNotes));

    const activeBlock = notes.activeBlock;
    const prevBlock = previousBlock(notes, blockId);

    const siblings = siblingsArray(notes, blockId);
    const index = siblings.indexOf(blockId);
    siblings.splice(index, 1);
    return { ...notes, 
        'activeBlock': {...activeBlock, 
            blockId: prevBlock.id,
            selfFocus: false,
            pos: false,
            payload 
        }
    };
}

/* ______________________________________________________________________________________ */

// TODO comment.
export function previousBlock(notes, blockId) {

    const blocks = notes.blocks;
    const thisBlock = blocks.byId[blockId];
    const adjacents = adjacentSiblings(notes, blockId);

    if (adjacents.previousSibling === null){
        if (thisBlock.parentId === null)
            return null;
        return blocks.byId[thisBlock.parentId];
    }

    let blockPointer = adjacents.previousSibling;
    
    while (blockPointer && blockPointer.children.length > 0) {
        blockPointer = blocks.byId[blockPointer.children[blockPointer.children.length - 1]];
    }
    return blockPointer;
    
}

// TODO comment.
export function nextBlock(notes, blockId) {
    const adjacents = adjacentSiblings(notes, blockId);

    let blockPointer = adjacents.nextSibling;
    while (blockPointer === null) {
        if (blockPointer.parentId === null)
            return null;
        adjacents = adjacentSiblings(notes, blockPointer.parentId);
        blockPointer = adjacents.nextSibling;
    }
    return blockPointer;
}

// TODO comment.
export function adjacentSiblings(notes, blockId) {
    
    const blocks = notes.blocks;
    
    const adjacents = { previousSibling: null, nextSibling: null };
    const siblings = siblingsArray(notes, blockId);
    const index = siblings.indexOf(blockId);
    if (index > 0){
        adjacents.previousSibling = blocks.byId[siblings[index - 1]];
    }
    
    if (index < siblings.length - 1){
        adjacents.nextSibling = blocks.byId[siblings[index + 1]];
        
    }
    
    return adjacents;
}

export function siblingsArray(notes, blockId) {
    const blocks = notes.blocks;
    const thisBlock = blocks.byId[blockId];

    let siblings = notes.bodyBlocks;
    if(thisBlock.parentId !== null)
        siblings = blocks.byId[thisBlock.parentId].children;
    
    return siblings;
}