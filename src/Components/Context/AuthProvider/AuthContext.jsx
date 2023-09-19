import { useState,useEffect,useRef,createContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Axios/api";
import { Toast } from 'primereact/toast';
import axios from "axios";
import Carregamento from "../../Pages/Carregamento";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const toast = useRef(null);
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false)
  const[user,setUser] = useState()
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')


    if(token && userData){
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
      setAuthenticated(true);
      setUser(JSON.parse(userData))
 
    }

    setLoading(false)

  
  }, [])
  

  const handleLogin = async (login, senha) => {
    
    try {
      const tokenResponse = await axios.post('http://localhost:8080/login', {
        cpf: login,
        senha: senha,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    

      if (tokenResponse.status === 200) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Logado com Sucesso', life: 1000 });

        // Salve o token JWT no localStorage			
        localStorage.setItem('authToken', JSON.stringify(tokenResponse.data.token));
        localStorage.setItem('userData', JSON.stringify(tokenResponse.data.userData));
        api.defaults.headers.Authorization = `Bearer ${tokenResponse.data.token}`;

        setAuthenticated(true);

        setUser(tokenResponse.data.userData);

        console.log(tokenResponse.data.userData)

         if (tokenResponse.data.userData.tipo === 'true') {
           setTimeout(() => {
            navigate("/home");
           }, 1000)
        } else {
          setTimeout(() => {
            navigate("/registro");
          }, 1000)
        }
       } 

    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'CPF ou Senha Inválidos', life: 1000 });
      console.error('Erro ao buscar os dados:', error);
    }
  };

  if(loading) {
    return <Carregamento />;
  }

  function handleLogout() {
    setTimeout(() => {
      navigate("/login");
    }, 100)
  }



  return (
    <AuthContext.Provider value={{ authenticated,user, handleLogin, handleLogout }}>
      <Toast ref={toast} />
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }
