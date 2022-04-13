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

        default: {
            block = <TextLine
                placeholder={"Type '/' for commands"}
                {...rest} />;
            break;
        }

    }
    return (block)
}

export default BlockSelector