export function getPickerBox(pickerTextElement) {
    let noteBlock = pickerTextElement.closest('.note-block');
    const rect = noteBlock.getBoundingClientRect();

    const hl = rect.top > window.innerHeight - rect.bottom;
    let pos = hl ? { bottom: (noteBlock.offsetParent.scrollHeight - noteBlock.offsetTop + 3) + 'px'} : 
        { top: noteBlock.offsetTop + noteBlock.offsetHeight + 3 + 'px'};

    let box =  {
        left: pickerTextElement.offsetLeft + 7 + 'px',
        width: '300px',
        height: 'calc(50% - 30px)',
        maxHeight: '200px'
    }           
    Object.assign(box, pos);
    return box;
}