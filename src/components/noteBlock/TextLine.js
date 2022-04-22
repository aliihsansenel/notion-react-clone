import React, { useRef, useState, useEffect, useContext } from 'react';

import { keyDownEnter, keyDownTab, keyDownBackspace, keyDownArrow, keyDownSlash } from "util/editor/keyboard";


import { NoteContext } from 'pages/components/NoteEditor';
import { getPickerBox } from 'util/editor/layout';

function TextLine({ html, placeholder, hasFocus, activeBlock, handlers }) {
    const { pickerState } = useContext(NoteContext);
    const [ picker, setPicker ] = pickerState;

    const elementRef = useRef();

    function focusHandler(event) {
    }
    function keyDownHandler(event) {
        const element = elementRef.current;
        let payload = null;
        let dir = null;

        switch (event.key) {
            case 'Enter':
                payload = keyDownEnter(element, event);
                closeBlockPicker();   
                handlers.newLineHandler(payload);
                                                                    break;
            case 'Backspace':
                payload = keyDownBackspace(element, event);
                if (payload === false) break;
                handlers.deleteHandler(payload, 'prev');            break;
            case 'Tab':
                dir = keyDownTab(element, event);
                if (dir === null) break;
                handlers.indentationHandler(dir);                   break;
            case 'ArrowLeft':
                dir = keyDownArrow(element, 'prev');
                if (dir === null) break;
                handlers.navHandler(dir);                           break;
            case 'ArrowRight':
                dir = keyDownArrow(element, 'next');
                if (dir === null) break;
                handlers.navHandler(dir);                           break;
            case '/':
                if (!picker.show){
                    const pickerTextElement = keyDownSlash(event, picker.no);
                    const box = getPickerBox(pickerTextElement);
                    setPicker((picker) => { return {...picker, show: true, text: null, box }});
                }
                                                                    break;
            default:
                
            break;
        }
    }
    function keyUpHandler(event) {
        if (picker.show) {
            const element = elementRef.current.querySelector(`.picker-text[no="${picker.no}"]`);
            if (element === null)
                closeBlockPicker();
            else
                updatePickerText(element.innerText.substring(1));
        }
    }
    
    function blurHandler() {
        handlers.blurHandler(elementRef.current.innerHTML);
    }
    // TODO comment
    function closeBlockPicker() {
        setPicker((picker) =>  { 
            if(!picker.show)
                return picker;
            return {show: false, text: null, box: null, no: picker.no + 1}});
    }
    function updatePickerText(content) {
        setPicker((picker) => { return {...picker, text: content }});
    }
    useEffect(() => {
        const element = elementRef.current;
        if (!hasFocus) return;

        element.focus();

        const range = document.createRange();
        range.selectNodeContents(element);
        const payload = activeBlock.payload;

        if (payload !== null) {

            if (activeBlock.pos === true) {
                range.collapse(true);
                range.insertNode(payload);
                range.collapse(true);
            } else {
                range.collapse(false);
                range.insertNode(payload);
                range.collapse(true);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else {
            range.collapse(activeBlock.pos);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }, [hasFocus]);

    return (
        <p className="text-line"
            data-placeholder={placeholder}
            contentEditable
            ref={elementRef}

            onFocus={focusHandler}
            onKeyDown={keyDownHandler}
            onKeyUp={keyUpHandler}
            onBlur={blurHandler}

            dangerouslySetInnerHTML={{__html: html}}
            suppressContentEditableWarning 
        />
    )
}

export default TextLine;