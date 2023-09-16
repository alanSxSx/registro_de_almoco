import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthProvider/AuthContext';
import { useContext } from 'react';
import Carregamento from '../Pages/Carregamento';
import Registro from '../Pages/Registro';
import Home from '../Pages/Home';

const ProtectedLayout = ({ element, isPrivate, children }) => {
  const { authenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (isPrivate && authenticated && user.tipo === 'false') {

      setTimeout(() => {
      navigate("/registro")
      setLoading(false)
      }, 100);

    } else {
      setLoading(false);
    }
  }, [isPrivate, authenticated, user, navigate,loading]);

  if (isPrivate && (!authenticated)) {
    return (
      <>
        Você não tem permissão para acessar esta página.
      </>
    )
      ;
  }

  if (loading) {
    return <Carregamento />; // Renderize a página de carregamento enquanto o redirecionamento está em andamento.
  }


  return children;
};

export default ProtectedLayout;
