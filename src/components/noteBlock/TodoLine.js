import React, { useState, useContext } from 'react'

import TextLine from './TextLine'

import { NoteContext } from "pages/components/NoteEditor";

function TodoLine(props) {
    const { noteState } = useContext(NoteContext);
    const [notes, setNotes] = noteState;
    
    const blockId = props.block.id;
    const checked = props.block.checked;

    function changeHandler(event) {
        const input = event.target;

        if(input.checked !== checked)
            setNotes(setTodoState(notes, blockId, input.checked));
    }

    return (
        <div className='todo-line'>
            <div className='checkbox-cont' >
                <input type="checkbox" onChange={changeHandler}/>
            </div>
            <div className={ checked ? 'line-through' : '' }>
                <TextLine 
                        placeholder={"To-do"}
                        {...props}
                    />
            </div>
        </div>
    )
}

export default TodoLine

function setTodoState(notes, blockId, checked) {
    const blocks = {...notes.blocks};

    let block = { ...blocks[blockId] };
    block.checked = checked;

    return  { ...notes, blocks: {...blocks, [blockId]: block }};
}