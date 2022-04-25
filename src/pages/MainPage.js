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

{/* <Routes>
    <Route path="tatoeba" element={<TatoebaSearchPage />} />
    <Route path="lists" element={<MyListsBrowserPage />} />
    <Route path="/" element={<MyListsBrowserPage />} />
</Routes> */}