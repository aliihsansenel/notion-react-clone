import React from 'react'
import TextLine from './TextLine'

const Style = {
    display: "flex"
};

function TodoLine(props) {
    return (
        <div style={Style}>
            <input type="checkbox" />
            <TextLine
                    placeholder={"To-do"}
                    {...props}
                />
        </div>
    )
}

export default TodoLine