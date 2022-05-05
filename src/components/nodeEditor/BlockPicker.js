import React, { useState, useRef, useMemo, useContext, useEffect } from 'react'

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
const allCategories = ['basic blocks', 'test category'];

const PickerContext = React.createContext();

function BlockPicker({ text, box, handlers }) {
    
    if (text !== null)
        text = text.trim().toLowerCase();
    
    const [typeSelectHandler, pickerKeyDownHandler ] = handlers;
    const [activeItem, setActiveItem] = useState(0);

    const hits = useMemo(search, [text]);
    useEffect(() => { setActiveItem(0) }, [text]);
    
    function search() {
        let hits = {};
        let counter = 0;

        hits.categories = [];
        hits.lengths = [0];

        allCategories.forEach((categoryName, _) => {
            hits[categoryName] = searchCategory(categoryName, text);
            const length = hits[categoryName].length;
            if (length){
                hits.categories.push(categoryName);
                counter += length;
                hits.lengths.push(counter);
            }
        });

        hits.length = counter;
        return hits;
    }
    function getActiveType() {
        let i = 0;
        while(activeItem >= hits.lengths[i + 1] && i < hits.lengths.length - 1) { i++; }
        let category = hits[hits.categories[i]];
        return category[activeItem - hits.lengths[i]].type;
    }
    pickerKeyDownHandler.current = keyDownHandler;

    function keyDownHandler(event) {
        const index = activeItem;
        if (hits.length === 0) return;
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (index > 0)
                setActiveItem(index - 1);
            else
                setActiveItem(hits.length - 1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (hits.length - 1 > activeItem)
                setActiveItem(index + 1);
            else
                setActiveItem(0);
        } else if (event.key === 'Enter') {
            typeSelectHandler(getActiveType());
        }
    }
    return (
        <PickerContext.Provider value={{ activeItemState: {activeItem, setActiveItem}, typeSelectHandler }}>
            <div className='block-picker'
                style={box}
                onKeyDown={keyDownHandler}
            >
                {!hits.length && <span>No results</span>}
                {hits.length !== 0 && hits.categories.map((category, _) => {
                    const categoryHits = hits[category];
                        return (
                            <Category key={category} 
                                name={category} hitItems={categoryHits} baseIndex={hits.lengths[_]}/>
                        )
                    })
                }
                
            </div>
        </PickerContext.Provider>
    )
}

export default BlockPicker

function Category({ name, hitItems, baseIndex} ) {
    return (
            <div className='category'>
                <span className='category-title'>{name}</span>
                <ul className='category-list'>
                    {hitItems.map((item, _) => {
                        return (
                            <CategoryItem key={_} hit={item} index={ baseIndex + _} />
                        )
                    })
                    }
                </ul>
            </div>
        )
}

function CategoryItem({ hit, index }) {
    const { activeItemState, typeSelectHandler } = useContext(PickerContext);
    const {activeItem, setActiveItem} = activeItemState;
    const [active, setActive] = useState(false);

    function clickHandler() {
        typeSelectHandler(hit.type);
    }
    useEffect(() => {
        if (index === activeItem) {
            setActive(true);
        } else if(active){
            setActive(false);
        }
    }, [activeItem]);
    
    return (
        <li onClick={clickHandler} className={active ? 'highlighted': ''}>
            <span>{hit.title}</span>
            <span>{hit.description}</span>
        </li>
    )
}

function searchCategory(categoryName, query) {
    const category = blockTypes[categoryName];

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