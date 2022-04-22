import React from 'react'

function BlockPicker({ text, box }) {
    return (
        <div className='block-picker'
            style={box}
        >
            { text || '' }
        </div>
    )
}

export default BlockPicker