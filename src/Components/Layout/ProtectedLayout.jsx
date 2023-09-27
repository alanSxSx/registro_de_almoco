import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider/AuthContext";
import Carregamento from "../Pages/Carregamento";

const ProtectedLayout = ({ isPrivate, children }) => {
  const { authenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPrivate && authenticated && user.tipo === "false") {
      setTimeout(() => {
        navigate("/registro");
        setLoading(false);
      }, 100);
    } else if (!authenticated)
      setTimeout(() => {
        navigate("/login");
        setLoading(false);
      }, 100);
    else {
      setLoading(false);
    }
  }, [isPrivate, authenticated, user, navigate, loading]);

  if (loading) {
    return <Carregamento />; // Renderize a página de carregamento enquanto o redirecionamento está em andamento.
  }

  return children;
};

export default ProtectedLayout;
