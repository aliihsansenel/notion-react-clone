import React, { useRef, useState, useEffect, useContext } from 'react';

import { keyDownEnter, keyDownTab, keyDownBackspace, keyDownArrow, keyDownSlash } from "util/editor/keyboard";


import { NoteContext } from 'pages/components/NoteEditor';
import { getPickerBox } from 'util/editor/layout';

function TextLine({ html, placeholder, hasFocus, activeBlock, handlers }) {
    const { pickerState, handlers: { pickerKeyDownHandler } } = useContext(NoteContext);
    const [ picker, setPicker ] = pickerState;

    const elementRef = useRef();

    function register() {
        handlers.registrationHandler(elementRef.current.innerHTML);
    }
    function keyDownHandler(event) {
        const element = elementRef.current;
        let payload = null;
        let dir = null;

        switch (event.key) {
            case 'Enter':
                if (picker.show) {
                    event.preventDefault();
                    pickerKeyDownHandler.current(event);
                } else {
                    payload = keyDownEnter(element, event);
                    register();
                    handlers.newLineHandler(payload);
                }
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
            case 'ArrowUp':
                if (picker.show){
                    event.preventDefault();
                    pickerKeyDownHandler.current(event);                    break;
                }
            case 'ArrowDown':
                if (picker.show){
                    event.preventDefault();
                    pickerKeyDownHandler.current(event);                    
                }                                                    break;
            case '/':
                if (!picker.show){
                    const pickerTextElement = keyDownSlash(event, picker.no);
                    const box = getPickerBox(pickerTextElement);
                    const content = elementRef.current.textContent;
                    const isBlockEmpty = !content || content === '/';
                    setPicker((picker) => { 
                        return {...picker, show: true, text: '', box, isBlockEmpty }
                    });
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
        handlers.registrationHandler(elementRef.current.innerHTML);
    }
    // TODO comment
    function closeBlockPicker() {
        setPicker((picker) =>  { 
            if(!picker.show)
                return picker;
            return {show: false, text: null, box: null, no: picker.no + 1}});
    }
    function updatePickerText(content) {
        setPicker((picker) => { 
            if(picker.text !== content){
                return {...picker, text: content }
            }
            return picker;
        });
    }
    useEffect(() => {
        if (!hasFocus) return;
        const element = elementRef.current;
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
        } else if (!activeBlock.selfFocus) {
            range.collapse(activeBlock.pos);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        return function cleanup() {
            if(hasFocus) {

            }
        }
    }, [activeBlock]);

    return (
        <p className="text-line"
            data-placeholder={placeholder}
            contentEditable
            ref={elementRef}

            onKeyDown={keyDownHandler}
            onKeyUp={keyUpHandler}
            onBlur={blurHandler}

            dangerouslySetInnerHTML={{__html: html}}
            suppressContentEditableWarning
        />
    )
}

export default TextLine;