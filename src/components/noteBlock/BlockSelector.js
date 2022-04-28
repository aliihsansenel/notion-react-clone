import React from 'react'

import TextLine from './TextLine';
import TodoLine from './TodoLine';

function BlockSelector({ type, ...rest }) {
    let block = null;

    switch (type) {
        case 'todo': {
            block = <TodoLine {...rest} />;
            break;
        }
        case 'h1': {
            block = <h1><TextLine
                placeholder={"Heading 1"}
                {...rest} /></h1>;
            break;
        }
        case 'h2': {
            block = <h2><TextLine
                placeholder={"Heading 2"}
                {...rest} /></h2>;
            break;
        }
        case 'h3': {
            block = <h3><TextLine
                placeholder={"Heading 3"}
                {...rest} /></h3>;
            break;
        }

        default: {
            block = <TextLine
                placeholder={"Type '/' for commands"}
                {...rest} />;
            break;
        }

    }
    return (block)
}

export default BlockSelector;

export function getNoteBlockStyle(type) {
    let style = { marginTop: '1px', marginBottom: '1px' };
    switch (type) {
        case 'h1':
            style = { ...style, marginTop: '2rem' };
            break;
        case 'h2':
            style = { ...style, marginTop: '1.4rem' };
            break;
        case 'h3':
            style = {...style,  marginTop: '1rem' };
            break;
        default: {
            
            break;
        }

    }
    return style;
}