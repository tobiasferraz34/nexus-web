import React, { Component } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

export default class Polo extends Component {
  constructor(props) {
    super();
    this.state = {
      success: '',
      error: '',
      showModalCliente: false,
      showModalOficina: false,

      //Informações do usuário
      nome: '',
      email: '',
      cpf_cnpj: '',
      senha: '',
      confirmarSenha: ''
    }
  }

  cadastrarPolo = async (e) => {
    e.preventDefault();
    this.setState({ sucess: '', error: '' });
    const nome = this.state.nome;
    const email = this.state.email;
    const cpf_cnpj = this.state.cpf_cnpj;
    const id_permissao = 3;
    const senha = this.state.senha;
    const confirmarSenha = this.state.confirmarSenha;

    const senhaInvalida = senha !== confirmarSenha ? true : false;

    if (!nome || !email || !senha || !confirmarSenha) {
      this.setState({ error: 'Por favor, preencher todos os campos.' });
    } else if (senhaInvalida) {
      this.setState({ error: 'Por favor, informe senhas iguais.' });
    } else {
      try {
        const response = await fetch(`${api.baseURL}/usuarios`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome,
            cpf_cnpj,
            id_permissao,
            email,
            senha
          }),
        });

        const data = await response.json();
        console.log(data)

        if (data.status === 200) {
          this.setState({ success: data.msg });
          
        }

        if (data.status === 400) {
          this.setState({ error: data.msg });
        }
      } catch (error) {
        this.setState({ error: 'Ocorreu um erro' });
      }
    }
  };

  render() {
    return (
      <Container>
        <Navbar />
        <h3 style={{ marginTop: '100px', color: '#F9CC00' }}>Registro do Polo</h3>

        <Form onSubmit={this.cadastrarPolo}>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="nome"
                  placeholder="Digite seu nome"
                  onChange={(e) =>
                    this.setState({ nome: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Informe o seu email"
                  onChange={(e) =>
                    this.setState({ email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-md-12">
              <div class="form-group">
                <label htmlFor="select_Usuario">CPF/CNPJ</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder="CNPJ"
                  name="CNPJ"
                  onChange={(e) =>
                    this.setState({ cpf_cnpj: e.target.value })
                  }
                />
              </div>
            </div>
          </div>


          <div className="row" style={{ marginBottom: 20 }}>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="senha"
                  placeholder="Informe sua senha"
                  onChange={(e) =>
                    this.setState({ senha: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="repetir_senha">Repetir Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="repetir_senha"
                  placeholder="Informe sua senha novamente"
                  onChange={(e) =>
                    this.setState({ confirmarSenha: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {this.state.success && (
            <div class="alert alert-success text-center" role="alert">
              {this.state.success}
            </div>
          )}
          {this.state.error && (
            <div className="alert alert-danger text-center" role="alert">
              {this.state.error}
            </div>
          )}

          <div className="row">
            <div className="col-md-12 text-center">
              <button className="button" type="submit">
                Cadastrar
              </button>
            </div>
          </div>

          <hr />

          <p className='lead'>Para realizar o seu acesso, clique no link abaixo e informe o email e a senha cadastrada.</p>
      
          <div className="row">
            <div className="col-md-12 text-center">
              <a href="/">Acessar</a>
            </div>
          </div>
        </Form>
      </Container >
    );
  }
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #000233;
  height: 100%;
`;

const Form = styled.form`
  width: 550px;
  border-radius: 15px;
  background-color: #ffffff;
  padding: 15px;
  box-shadow: 8px 8px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  margin-bottom: 200px;
  
  .button {
    background-color: #000233;
    border: 1px solid #000233;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Arial;
    font-size: 16px;
    padding: 4px 90px;
    text-decoration: none;
    text-shadow: 0px 1px 0px #000233;
  }
  .button:hover {
    background-color: #ffffff;
    color: #000233;
  }
  .button:active {
    position: relative;
    top: 1px;
  }
  .button:focus {
    outline-style: none;
  }

  @media only screen and (min-width: 320px) and (max-width: 725px) {
    width: 300px;
  }
`;
