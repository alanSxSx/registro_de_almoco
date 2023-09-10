import React, { useState, useEffect } from 'react';

export default function Testando() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/users')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Verifique se a resposta é um array antes de definir o estado
          setUsers(data);
        } else {
          console.error('A resposta não é um array:', data);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar os usuários:', error);
      });
  }, []);

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
