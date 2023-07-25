import { useState } from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import { Routes, Route } from "react-router-dom";
import { Container } from './Components/Layout/Container';

import './App.css'
import Login from './Components/Pages/Login'
import Home from './Components/Pages/Home';

function App() {

  return (
    <>
      <Router>
      <Container customClass="min-height" >

      <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />

      </Routes>
      
      </Container>
      </Router>
      
    </>
  )
}

export default App
