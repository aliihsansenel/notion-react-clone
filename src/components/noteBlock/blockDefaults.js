export function getDefaultBlock(type) {
    let block = { id: null, type, level: null };
    switch (type) {
        case 'todo':
            block.checked = false;
            break;
        default:
            break;
    }
    return block;
}