import React, { useEffect, useState } from 'react';
import '../assets/styles/App.css';
import Header from './Header';
import Todo from './Todo';

function App() {

  return (
    <>
      <Header />
      <Todo />
    </>
  );
}

export default App;
