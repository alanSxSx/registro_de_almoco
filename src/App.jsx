import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import { Container } from './Components/Layout/Container';
import { AuthProvider } from './Components/Context/AuthProvider/AuthContext';

import './App.css'
import Login from './Components/Pages/Login'
import Home from './Components/Pages/Home';
import Cadastro from './Components/Pages/Cadastro';
import Configuracao from './Components/Pages/Configuracao';
import Registro from './Components/Pages/Registro';
import Marcacoes from './Components/Pages/Marcacoes';
import ProtectedLayout  from './Components/Layout/ProtectedLayout';



function App() {

  return (
    <>
    <Router>
    <AuthProvider>
      <Container customClass="min-height" >
     
      <Routes>
    
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<ProtectedLayout isPrivate={true} ><Home /></ProtectedLayout>} />     
      <Route path="/configuracao" element={<ProtectedLayout isPrivate={true} > <Configuracao /> </ProtectedLayout>} />
      <Route path="/registro" element={<ProtectedLayout isPrivate={true}> <Registro /> </ProtectedLayout>} />
      <Route path="/cadastro" element={<ProtectedLayout isPrivate={true} > <Cadastro /> </ProtectedLayout>} />
      <Route path="/marcacoes" element={<ProtectedLayout isPrivate={true} > <Marcacoes /> </ProtectedLayout>} />
    
      
      </Routes> 
     
      </Container>
      </AuthProvider>
      </Router>

      
      
    </>
  )
}

export default App
