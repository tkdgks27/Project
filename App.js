import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './main/main';
import FileUpload from './gallery/fileUpload';
import SignIn from './signin/signIn';
import CssFirst from './CSS/cssFirst';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/gallery" element={<FileUpload />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
