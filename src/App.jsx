import { useState } from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import { Routes, Route } from "react-router-dom";
import { Container } from './Components/Layout/Container';

import './App.css'
import Login from './Components/Pages/Login'

function App() {

  return (
    <>
      <Router>
      <Container customClass="min-height" >

      <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      </Routes>
      
      </Container>
      </Router>
      
    </>
  )
}

export default App
