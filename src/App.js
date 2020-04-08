//importação do React e dos controles de estado e imutabilidade
//para que seja possível a atualização dos dados da api
import React, { useState, useEffect } from "react";
//importando a api que é a conexão do frontend com o backend
import api from './services/api';

import "./styles.css";

function App() {
  //desestruturação dos estados dos respositórios
  //primeiro parâmetro a variável que recebe os respositórios
  //segundo parâmetro a função responsável pela alteração dos reps
  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    //qdo a função assíncrona é chamada, ela espera a resposta do post com os dados
    //como feito no backend, é retornado o json com os dados do novo registro e o status da req
    const response = await api.post('repositories', {
      id: "123",
      url: "https://github.com/josepholiveira",
      title: "Desafio ReactJS",
      techs: ["React", "Node.js"],
    });
    //caso o backend retornar status code 200 ele recebe os dados do objeto recebido
    //e através do spread operator percorre o array anterior inserindo os valores neste novo array
    //e insere o novo dado. Note que isso é diferente de dar um push no mesmo elemento.
    if(response.status === 200){
      const repository = response.data;
      setRepositories([...repositories, repository]);
    }    
  }

  async function handleRemoveRepository(id) {
    //no backend ficou definido que o único parâmetro retornado no delete é o status code
    //a função assíncrona aguarda o resultado do backend e armazena o valor na variavel response
    const response = await api.delete(`repositories/${id}`);

    //se o status code for 204 ele envia para a lista de repositórios um novo array
    //com um filtro onde o valor do id informado é eliminado
    if(response.status === 204){
      setRepositories(repositories.filter(repository => repository.id !== id));
    }    
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map( repository => <li key={repository.id}>
          <h1>{repository.title} </h1>
          <button onClick={() => handleRemoveRepository(repository.id)}>
            Remover
          </button>
        </li>)}         
        
      </ul>

      <button type="button" onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
