import { FaUserGraduate, FaClipboardList } from 'react-icons/fa';
import React, { Component } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { getToken, logout } from '../../services/auth';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import ReactToPrint from 'react-to-print';
import Prova from '../../components/Prova';

export default class Index extends Component {
    constructor(props) {
        super();
        this.state = {
            success: '',
            error: '',
            modalShowCadastrarAluno: false,
            modalShowGerarProva: false,
            modalShowExibirProva: false,
            //Dados do aluno polo
            codigo_requerimento: '',
            data_solicitacao: '',
            cpf: '',
            nomeAluno: '',
            arrayAlunos: [],
            id_aluno: 0,
            id_disciplina: '',
            anoLetivo: '',
            arrayProvasDoAluno: [],
            id_prova: 0,
            prova: [],
            disciplina: '',
            arrayDisciplinas: []
        }
    }

    componentDidMount() {
        this.listaAlunos(getToken());
    }

    setModalShowExibirProva(valor) {
        this.setState({ modalShowExibirProva: valor, success: '', error: '' });
    }

    handlerShowModalExibirProva(prova) {
        this.buscaProva(getToken(), prova.id_prova);
        this.setState({ id_prova: prova.id_prova, disciplina: prova.disciplina, anoLetivo: prova.serie });
        this.setModalShowExibirProva(true);
    }

    handlerCloseModalExibirProva() {
        this.setModalShowExibirProva(false);
    }

    setModalShowCadastrarAluno(valor) {
        this.setState({ modalShowCadastrarAluno: valor, success: '', error: '' });
    }

    handlerShowModalCadastrarAluno() {
        this.setModalShowCadastrarAluno(true);
    }

    handlerCloseModalCadastrarAluno() {
        this.setModalShowCadastrarAluno(false);
    }

    setModalShowGerarProva(valor) {
        this.setState({ modalShowGerarProva: valor, success: '', error: '' });
    }

    handlerShowModalGerarProva(aluno) {
        this.listaDeProvasDoAluno(getToken(), aluno.id);
        this.listaDisciplinas(getToken());
        this.setModalShowGerarProva(true);
        this.setState({ id_aluno: aluno.id, cpf: aluno.cpf, nomeAluno: aluno.nome, data_solicitacao: aluno.inputDataHoraCriacao });
    }

    handlerCloseModalGerarProva() {
        this.setModalShowGerarProva(false);
        this.setState({ id_aluno: '', cpf: '', nomeAluno: '', data_solicitacao: '', arrayProvasDoAluno: [] });
    }

    cadastrarAluno = async (e) => {
        e.preventDefault();
        this.setState({ success: '', error: '' });
        const data_solicitacao = this.state.data_solicitacao;
        const cpf = this.state.cpf;
        const nome = this.state.nomeAluno;

        if (!data_solicitacao || !cpf || !nome) {
            this.setState({ error: 'Por favor, preencher todos os campos.' });
        } else {
            try {
                const response = await fetch(`${api.baseURL}/alunos`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': getToken()
                    },
                    body: JSON.stringify({
                        data_solicitacao,
                        cpf,
                        nome
                    }),
                });

                const data = await response.json();
                console.log(data)

                if (data.status === 200) {
                    this.setState({ success: data.msg });
                    this.listaAlunos(getToken());
                }

                if (data.status === 400) {
                    this.setState({ error: data.msg });
                }
            } catch (error) {
                this.setState({ error: 'Ocorreu um erro' });
            }
        }
    }

    listaAlunos = async (token) => {
        try {
            const response = await fetch(`${api.baseURL}/polos/${token}/alunos`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
            });

            const data = await response.json();
            console.log(data);

            if (data.status === 200) {
                this.setState({ arrayAlunos: data.resultados });
            }

            if (data.permissoes === false) {
                logout();
                this.props.history.push("/");
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    listaDeProvasDoAluno = async (token, id_aluno) => {
        try {
            const response = await fetch(`${api.baseURL}/alunos/${token}/provas?idAluno=${id_aluno}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
            });

            const data = await response.json();
            console.log(data);

            if (data.status === 200) {
                this.setState({ arrayProvasDoAluno: data.resultados });
            }

            if (data.permissoes === false) {
                logout();
                this.props.history.push("/");
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    gerarProva = async (e) => {
        e.preventDefault();
        this.setState({ success: '', error: '' })

        const id_disciplina = parseInt(this.state.id_disciplina);
        const anoLetivo = parseInt(this.state.anoLetivo);
        const id_aluno = parseInt(this.state.id_aluno);
        const codigo_requerimento = parseInt(this.state.codigo_requerimento);
        console.log(id_disciplina, anoLetivo, id_aluno, codigo_requerimento);

        if (!codigo_requerimento || !id_disciplina || !anoLetivo > 0) {
            this.setState({ error: 'Por favor, preencher todos os campos.' });
        } else {
            try {
                const response = await fetch(`${api.baseURL}/alunos/${id_aluno}/provas`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': getToken()
                    },
                    body: JSON.stringify({
                        id_disciplina,
                        anoLetivo,
                        id_aluno,
                        codigo_requerimento
                    }),
                });

                const data = await response.json();
                console.log(data)

                if (data.status === 200) {
                    this.setState({ success: data.msg });
                    this.listaDeProvasDoAluno(getToken(), id_aluno);
                }

                if (data.status === 400) {
                    this.setState({ error: data.msg });
                }
            } catch (error) {
                this.setState({ error: 'Ocorreu um erro' });
            }
        }
    }

    buscaProva = async (token, id_prova) => {
        try {
            const response = await fetch(`${api.baseURL}/provas/${id_prova}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
            });

            const data = await response.json();
            console.log(data);

            if (data.status === 200) {
                this.setState({ prova: data.result });
            }

            if (data.permissoes === false) {
                logout();
                this.props.history.push("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    listaDisciplinas = async (token) => {
        try {
            const response = await fetch(`${api.baseURL}/disciplinas`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
            });

            const data = await response.json();
            console.log(data);
            if (data.status === 200) {
                this.setState({ arrayDisciplinas: data.resultados });
            }

            if (data.permissoes === false) {
                logout();
                this.props.history.push("/");
            }

        } catch (error) {
            console.log(error);
        }
    };

    alterarAluno = async (e) => {
        e.preventDefault();
        this.setState({ success: '', error: '' });
        const id_aluno = this.state.id_aluno;
        const cpf = this.state.cpf;
        const nome = this.state.nomeAluno;

        try {
            const response = await fetch(`${api.baseURL}/alunos/${id_aluno}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': getToken(),
                },
                body: JSON.stringify({
                    cpf,
                    nome
                }),
            });

            const data = await response.json();
            console.log(data)

            if (parseInt(data.status) === 200) {
                this.setState({ success: data.msg });
                this.listaAlunos(getToken());
            }

            if (parseInt(data.status) === 400) {
                this.setState({ error: data.msg });
            }
        } catch (error) {
            console.log(error);
        }
    }


    render() {

        const alunos = this.state.arrayAlunos;
        const provas = this.state.arrayProvasDoAluno;
        const disciplinas = this.state.arrayDisciplinas;

        return (
            <Container>
                <Header />
                <Menu />
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">

                    </div>
                    {/* /.content-header */}
                    {/* Main content */}
                    <div className="content mt-5">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-9">
                                    <h3 className='titulo'><FaUserGraduate /> Lista de Requerimentos de Provas</h3>
                                </div>
                                <div className="col-sm-3 text-right">
                                    <button className='button' onClick={() => this.handlerShowModalCadastrarAluno()}>Cadastrar Aluno</button>
                                </div>
                            </div>
                            <hr />
                            <div className="table-responsive">
                                <div class="table-responsive-lg">
                                    <table className="table table-bordered table-hover">
                                        <thead class="thead-light">
                                            <tr>
                                                <th scope="col">Nome</th>
                                                <th scope="col">CPF</th>
                                                <th scope="col">Data de solicitação Req</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alunos.length > 0 ? (
                                                alunos.map(aluno => (
                                                    <tr key={aluno.id} title='Clique aqui para gerar provas do aluno' onClick={() => this.handlerShowModalGerarProva(aluno)}>
                                                        <td>{aluno.nome}</td>
                                                        <td>{aluno.cpf}</td>
                                                        <td>{aluno.data_solicitacao}</td>
                                                    </tr>
                                                ))
                                            ) : (<tr className="text-center">
                                                <td colSpan="10">
                                                    Nenhum aluno encontrado
                                                </td>
                                            </tr>)}
                                        </tbody>


                                    </table>
                                </div>
                            </div>
                            {
                                <div className="text-center font-weight-bold mt-3 mb-5">
                                    Total de Registros: {alunos.length}
                                </div>
                            }

                        </div>
                        {/* /.container-fluid */}
                    </div>
                    {/* /.content */}
                    <br />
                </div>
                <Modal

                    show={this.state.modalShowCadastrarAluno}
                    onHide={() => this.handlerCloseModalCadastrarAluno()}
                    aria-labelledby="contained-modal-title-vcenter"
                    backdrop="static"
                    size="md"
                    centered
                >
                    <Form onSubmit={this.cadastrarAluno}>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                <FaUserGraduate /> Registrar Informações do Aluno
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-12">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">CPF</label>
                                        <p className='text-danger'> Obs: *Informar apenas campos númericos</p>
                                        <input className="form-control" type="number" placeholder="CPF" name="cpf"
                                            onChange={e => this.setState({ cpf: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label for="exampleInputEmail1">Nome do Aluno</label>
                                        <input className="form-control" type="text" placeholder="Nome Completo" name="nome"
                                            onChange={e => this.setState({ nomeAluno: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Data de Solicitação</label>
                                        <input className="form-control" type="date" placeholder="Data de Solicitação" name="data_solicitacao"
                                            onChange={e => this.setState({ data_solicitacao: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    {this.state.success && (
                                        <div
                                            className="alert alert-success text-center"
                                            role="alert"
                                        >
                                            {this.state.success}
                                        </div>
                                    )}
                                    {this.state.error && (
                                        <div
                                            className="alert alert-danger text-center"
                                            role="alert"
                                        >
                                            {this.state.error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className='button'>Cadastrar</button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                <Modal
                    show={this.state.modalShowGerarProva}
                    onHide={() => this.handlerCloseModalGerarProva()}
                    aria-labelledby="contained-modal-title-vcenter"
                    backdrop="static"
                    size="xl"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter" className='titulo'>
                            <FaUserGraduate /> Dados do Requerente - {this.state.nomeAluno}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.alterarAluno}>
                            <div className="row">
                                <div className="col-md-3">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Data de Solicitação</label>
                                        <input className="form-control" type="date" placeholder="Data de Solicitação" name="data_solicitacao"
                                            value={this.state.data_solicitacao} disabled
                                            onChange={e => this.setState({ data_solicitacao: e.target.value })} />
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">CPF</label>
                                        <input className="form-control" type="number" placeholder="CPF" name="cpf"
                                            value={this.state.cpf}
                                            onChange={e => this.setState({ cpf: e.target.value })} />
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Nome do Aluno</label>
                                        <input className="form-control" type="text" placeholder="Nome Completo" name="nome"
                                            value={this.state.nomeAluno}
                                            onChange={e => this.setState({ nomeAluno: e.target.value })} />
                                    </div>
                                </div>
                                <div className="col-md-2" style={{ marginTop: '35px' }}>
                                    <button className='button'>Alterar Infor.</button>
                                </div>
                            </div>
                        </Form>

                        <Form onSubmit={this.gerarProva}>
                            <div className="row">
                                <div className="col-sm-12">
                                    {this.state.success && (
                                        <div
                                            className="alert alert-success text-center"
                                            role="alert"
                                        >
                                            {this.state.success}
                                        </div>
                                    )}
                                    {this.state.error && (
                                        <div
                                            className="alert alert-danger text-center"
                                            role="alert"
                                        >
                                            {this.state.error}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr />


                            <div className="row">
                                <div className="col-md-12">
                                    <h3><FaClipboardList />Provas</h3>
                                </div>
                            </div>

                            <hr/>

                            <div className="row">
                                <div class="col-md-4">
                                    <label class="sr-only" for="inlineFormInputGroup"></label>
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">Cód. de Req.</div>
                                        </div>
                                        <input className="form-control" type="number" name="codigo_requerimento"

                                            onChange={e => this.setState({ codigo_requerimento: e.target.value })} />
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <label class="sr-only" for="inlineFormInputGroup"></label>
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">Disciplina</div>
                                        </div>
                                        <select class="form-control" id="exampleFormControlSelect1" placeholder='Disciplina' onChange={e => this.setState({ id_disciplina: e.target.value })}>
                                            <option value="0">Selecione</option>
                                            {disciplinas.length > 0 ? (
                                                disciplinas.map(item => (
                                                    <option value={item.id}>{item.nome}</option>
                                                ))
                                            ) : (<option value="0">Selecione a disciplina</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <label class="sr-only" for="inlineFormInputGroup"></label>
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">Ano</div>
                                        </div>
                                        <select class="form-control" id="exampleFormControlSelect1" onChange={e => this.setState({ anoLetivo: e.target.value })}>
                                            <option value="0">0</option>
                                            <option value="6">6° ANO DO ENSINO FUNDAMENTAL</option>
                                            <option value="7">7° ANO DO ENSINO FUNDAMENTAL</option>
                                            <option value="8">8° ANO DO ENSINO FUNDAMENTAL</option>
                                            <option value="9">9° ANO DO ENSINO FUNDAMENTAL</option>
                                            <option value="1">1° ANO DO ENSINO MÉDIO</option>
                                            <option value="2">2° ANO DO ENSINO MÉDIO</option>
                                            <option value="3">3° ANO DO ENSINO MÉDIO</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md">
                                    <button className='button'>Gerar Prova</button>
                                </div>
                            </div>
                        </Form>

                        <hr />
                        <div className="table-responsive">
                            <div class="table-responsive-lg text-center">
                                <table className="table table-bordered table-hover">
                                    <thead class="thead-light">
                                        <tr>
                                            <th scope="col">Código do requerimento</th>
                                            <th scope="col">Disciplina</th>
                                            <th scope="col">Série</th>
                                            <th scope="col">Data e hora de Cad.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {provas.length > 0 ? (
                                            provas.map(item => (
                                                <tr key={item.id_prova} onClick={() => this.handlerShowModalExibirProva(item)}>
                                                    <td>{item.codigo_requerimento}</td>
                                                    <td>{item.disciplina}</td>
                                                    <td>{item.serie}</td>
                                                    <td>{item.dataHoraCriacao}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colSpan="15">
                                                    <Spinner animation="border" />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={this.state.modalShowExibirProva}
                    onHide={() => this.handlerCloseModalExibirProva()}
                    aria-labelledby="contained-modal-title-vcenter"
                    backdrop="static"
                    className='modal-fullscreen'
                    centered
                >

                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter" className='text-center'>
                            Informações da Prova de {this.state.disciplina} - {this.state.anoLetivo}° ano
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ReactToPrint
                            trigger={() => {
                                // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                                // to the root node of the returned component as it will be overwritten.
                                return <a href="#" className='button'>Imprimir Prova</a>;
                            }}
                            content={() => this.componentRef}
                        />
                        <Prova cpf={this.state.cpf} nome={this.state.nomeAluno} disciplina={this.state.disciplina} serie={this.state.anoLetivo} prova={this.state.prova} ref={el => (this.componentRef = el)} />
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
            </Container>
        )
    }
}

export const Container = styled.div`
  width: 100%;
  height: 100vh;

  .titulo {
	color: #000233;
  }
`;

export const Form = styled.form``;
