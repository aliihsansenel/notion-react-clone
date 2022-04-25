import React from 'react'

export const blockTypes = {
    'basic blocks': [
        {
            title: 'Text',
            description: 'Just start writing with plain text.'
        },
        {
            title: 'To-do list',
            description: 'Track tasks with a to-do list.',
            alt: 'todo'
        },
        {
            title: 'Heading 1',
            description: 'Big section heading.',
            alt: 'h1'
        },
        {
            title: 'Heading 2',
            description: 'Medium section heading.',
            alt: 'h2'
        },
        {
            title: 'Heading 3',
            description: 'Small section heading.',
            alt: 'h3'
        },
    ],
    'test category': [
        {
            title: 'Pest block',
            description: 'Block for testing search.',
            alt: ''
        },
    ]
};

function BlockPicker({ text, box }) {

    let hits = [];
    if (text !== null) 
        text = text.trim().toLowerCase();
    
    function searchCategory(name) {
        let category = <Category name={name} query={text} />;

        if(category)
            hits.push(category);
    }

    Object.keys(blockTypes).forEach(category => { searchCategory(category) });
    return (
        <div className='block-picker'
            style={box}
        >
            { hits || <span>No results</span> }
        </div>
    )
}

export default BlockPicker

function Category({ name, query}) {
    const category = blockTypes[name];

    function searchHits() {
        if (query === null ) return category;
        const unsatisfied = query.split(' ').filter((part) => {
            return name.indexOf(part) === -1;
        });

        if (unsatisfied.length === 0) return category;

        return category.filter(blockType => { 
            const result = unsatisfied.map(part => { 
                if (blockType.title.toLowerCase().indexOf(part) !== -1)
                    return true;
                if (blockType.alt && blockType.alt.indexOf(part) !== -1)
                    return true;
                return false;
            });
            return result.every(Boolean);
        });
    };

    const hits = searchHits();
    if (hits.length === 0) return null;
    return (
        <div className='category'>
            <span className='category-title'>{name}</span>
            <ul className='category-list'>
                { hits.map((hit, _) => {
                    return (
                        <li key={_} ><span>{hit.title}</span><span>{hit.description}</span></li>
                    )})
                }
            </ul>
            
        </div>
    )
}