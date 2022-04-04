import { BrowserRouter } from "react-router-dom";

import MainPage from "./pages/MainPage";

import './App.css';

import 'bootstrap/dist/css/bootstrap.css';

function App() {
    return (
        <BrowserRouter>
            <MainPage />
        </BrowserRouter>
    );
}

export default App;
