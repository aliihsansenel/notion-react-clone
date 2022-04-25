import React, { useRef, useMemo, useContext } from 'react'

export const blockTypes = {
    'basic blocks': [
        {
            type: 'text',
            title: 'Text',
            description: 'Just start writing with plain text.'
        },
        {
            type: 'todo',
            title: 'To-do list',
            description: 'Track tasks with a to-do list.',
            alt: 'todo'
        },
        {
            type: 'h1',
            title: 'Heading 1',
            description: 'Big section heading.',
            alt: 'h1'
        },
        {
            type: 'h2',
            title: 'Heading 2',
            description: 'Medium section heading.',
            alt: 'h2'
        },
        {
            type: 'h3',
            title: 'Heading 3',
            description: 'Small section heading.',
            alt: 'h3'
        },
    ],
    'test category': [
        {
            type: 'test',
            title: 'Pest block',
            description: 'Block for testing search.',
            alt: ''
        },
    ]
};

const PickerContext = React.createContext();

function BlockPicker({ text, box, handler }) {

    let hits = [];
    if (text !== null)
        text = text.trim().toLowerCase();

    const itemNumbers = useRef(0);
    function searchCategory(name) {
        let category = <Category key={name} name={name} query={text} />;

        if (category)
            hits.push(category);
    }

    Object.keys(blockTypes).forEach(category => { searchCategory(category) });
    return (
        <PickerContext.Provider value={{ itemNumbers, handler }}>
            <div className='block-picker'
                style={box}
            >
                {(hits.length && hits) || <span>No results</span>}
            </div>
        </PickerContext.Provider>

    )
}

export default BlockPicker

function Category({ name, query }) {
    const category = blockTypes[name];
    const { itemNumbers, handler } = useContext(PickerContext);
    const baseIndex = itemNumbers.current;

    const hits = useMemo(() => searchHits(query, category, name), [name, query])

    itemNumbers.current += hits.length;
    if (hits.length === 0) return null;
    return (
        <div className='category'>
            <span className='category-title'>{name}</span>
            <ul className='category-list'>
                {hits.map((hit, _) => {
                    return (
                        <CategoryItem key={_} hit={hit} index={baseIndex + _} />
                    )
                })
                }
            </ul>

        </div>
    )
}

function CategoryItem({ hit, index }) {
    const { handler } = useContext(PickerContext);

    function clickHandler() {
        handler(hit.type);
    }
    return (
        <li onClick={clickHandler}><span>{hit.title}</span><span>{hit.description}</span></li>
    )
}

function searchHits(query, category, categoryName) {
    if (query === null) return category;
    const unsatisfied = query.split(' ').filter((part) => {
        return categoryName.indexOf(part) === -1;
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
}