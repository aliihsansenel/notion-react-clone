import React, { useRef } from 'react';

import {
    Routes,
    Route,
} from "react-router-dom";
import NoteEditor from './components/NoteEditor';

import "./style.css";

function MainPage() {
    // const inputRef = useRef(null);

    return (
        <div className='main-page'>
            <div className='side-menu'>Options</div>    
            <NoteEditor />
        </div>
    )
}

export default MainPage;

{/* <div>
                <label>Choose a browser from this list:
                <input list="browsers" name="myBrowser" /></label>
                <datalist id="browsers">
                <option value="Chrome" otherValues="zyzz|lazlar"/>
                <option value="Firefox"/>
                <option value="Internet Explorer"/>
                <option value="Opera"/>
                <option value="Safari"/>
                <option value="Microsoft Edge"/>
                </datalist>
            </div> */}
{/* <Routes>
                <Route path="tatoeba" element={<TatoebaSearchPage />} />
                <Route path="lists" element={<MyListsBrowserPage />} />
                <Route path="/" element={<MyListsBrowserPage />} />
            </Routes> */}