import React, { Component } from 'react';
import { Container, Form, Img } from './styles';
import LogoAdmin from '../../assets/icon.png';
import api from '../../services/api';
import { setToken, setRole, ROLES } from '../../services/auth';

export default class Login extends Component {
    constructor(props) {
        super();
        this.state = {
            email: '',
            senha: '',
            error: ''
        }
    }

    handlerLogin = async e => {
        e.preventDefault()

        const { email, senha } = this.state;

        if (!email || !senha) {
            this.setState({ error: "Por favor, preencher todos os campos." });
        } else {
            try {
                const response = await fetch(`${api.baseURL}/login`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                });

                const data = await response.json();
                console.log(data)

                if (data.status === 200) {
                    setToken(data.token);
                    setRole(data.id_permissao);

                    if (data.permissao === "CERTIFICACAO") {
                        this.props.history.push("/certificacao");
                    }

                    if (data.permissao === "POLO") {
                        this.props.history.push("/provas");
                    }
                }

                if (data.status === 400) {
                    this.props.history.push("/");
                    this.setState({ error: data.msg })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    render() {
        return (
            <Container>
                {/* <Navbar /> */}
                <img src={LogoAdmin} className="mb-5" />
                <Form onSubmit={this.handlerLogin}>
                    <div className="row">
                        <div className="col-12">
                            {this.state.error && <div class="alert alert-danger text-center" role="alert">{this.state.error}</div>}

                            <div class="form-group">
                                <input className="form-control" type="email" placeholder="Email" name="email"
                                    onChange={e => this.setState({ email: e.target.value })} />
                            </div>

                            <div class="form-group">
                                <input className="form-control" type="password" placeholder="Senha" name="senha"
                                    onChange={e => this.setState({ senha: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    
                    <button class="button btn-block mt-4" type="submit">Entrar</button>
                        
                    <div className='row text-center mt-3'>
                        <div className='col-sm-6 '>
                            <a href="/criar_funcionario">Criar uma conta</a>
                        </div>
                        <div className='col-sm-6'>
                            <a href="/usuarios/cadastrar">Esqueceu a senha ?</a>
                        </div>
                    </div>
                </Form>
            </Container>
        )
    }
}