import {FaTrashAlt, FaRedo, FaUserGraduate, FaBuromobelexperte, FaExclamationTriangle, FaCalendarWeek, FaRegWindowClose, FaFileExport, FaPrint } from 'react-icons/fa';
import React, { Component } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { getToken, logout } from '../../services/auth';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import * as xlsx from 'xlsx/xlsx.mjs';
import { Card, Spinner } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import * as FileSaver from 'file-saver';
import Accordion from 'react-bootstrap/Accordion';


export default class Index extends Component {
	constructor(props) {
		super();

		this.state = {
			id_ciclo: '',
			nomeCiclo: '',
			mesEAnoCiclo: '',
			responsavel: '',
			arrayCiclos: [],
			modalShowCadastrarCiclo: false,
			modalShowEditarCiclo: false,
			modalShowCadastrarPendencia: false,
			modalShowEditarAluno: false,
			modalShowAdicionarObservacao: false,
			keyTab: 'Checklist',
			success: '',
			error: '',
			listaAlunos: [],
			listaAlunosCheckList: [],
			listaAlunosEPendencias: [],
			arquivoListaAlunos: null,
			checkCertificadoImp: 0,
			checkDeclaracaoImp: 0,
			checkCarimbos: 0,
			checkSelos: 0,
			checkAssinaturas: 0,
			checkListaImpressos: 0,
			checkEtiquetaImpressa: 0,
			nomePendencia: '',
			listaPendencias: [],
			listaPendenciasDoAluno: [],
			listaPendenciasDoCiclo: [],
			arrayAlunosPendencias: [],

			//Dados do aluno
			id_aluno: 0,
			observacao: '',
			nomeAluno: ''
		};
	}

	componentDidMount() {
		this.listaCiclos(getToken());
		this.listaPendencias(getToken());
	}

	setModalShowEditarAluno(valor) {
		this.setState({ modalShowEditarAluno: valor, success: '', error: '' });
	}

	handlerShowModalEditarAluno(aluno) {
		this.setModalShowEditarAluno(true);
		this.listaPendenciasDoAluno(getToken(), aluno.id_alunoG);
		console.log(aluno);
		this.setState({ id_aluno: aluno.id_alunoG })

	}

	handlerCloseModalEditarAluno() {
		this.setModalShowEditarAluno(false);
		this.setState({ listaPendenciasDoAluno: [] });
	};

	setModalShowCadastrarPendencia(valor) {
		this.setState({ modalShowCadastrarPendencia: valor, success: '', error: '' });
	}

	handlerShowModalCadastrarPendencia() {
		this.setModalShowCadastrarPendencia(true);
	}

	handlerCloseModalCadastrarPendencia() {
		this.setModalShowCadastrarPendencia(false);
	};

	setModalShowCadastrarCiclo(valor) {
		this.setState({ modalShowCadastrarCiclo: valor, success: '', error: '' });
	}

	handlerShowModalCadastrarCiclo() {
		this.setModalShowCadastrarCiclo(true);
	}

	handlerCloseModalCadastrarCiclo() {
		this.setModalShowCadastrarCiclo(false);
	};

	setModalShowEditarCiclo(valor) {
		this.setState({ modalShowEditarCiclo: valor });
	}

	handlerShowModalEditarCiclo(ciclo) {
		this.setModalShowEditarCiclo(true);
		this.setState({ id_ciclo: ciclo.id, nomeCiclo: ciclo.nome, arrayAlunosPendencias: [[]] });
		this.listaDeAlunosPorCiclos(getToken(), ciclo.id);
		this.listaDePendenciasPorCiclos(getToken(), ciclo.id);

	}

	handlerCloseModalEditarCiclo() {
		this.setModalShowEditarCiclo(false);
		this.setState({ id_ciclo: '', nomeCiclo: '', listaAlunosEPendencias: [], listaAlunosCheckList: [], listaDePendenciasPorCiclos: [] });
	};

	setModalShowAdicionarObservacao(valor) {
		this.setState({ modalShowAdicionarObservacao: valor, success: '', error: '' });
	}

	handlerShowModalAdicionarObservacao(aluno) {
		console.log(aluno);
		this.setState({ id_aluno: aluno.id, nomeAluno: aluno.nome, success: '', error: '' });
		this.setModalShowAdicionarObservacao(true);
	}

	handlerCloseModalAdicionarObservacao() {
		this.setModalShowAdicionarObservacao(false);
		this.setState({ id_aluno: 0, nomeAluno: '', success: '', error: '' });
	};

	cadastrarCiclo = async (e) => {
		e.preventDefault();
		this.setState({ success: '', error: '' });
		const nomeCiclo = 'CICLO - ';
		const mesEAnoCiclo = this.state.mesEAnoCiclo;
		if (!mesEAnoCiclo) {
			this.setState({ error: 'Por favor, preencher todos os campos.' });
		} else {
			try {
				const response = await fetch(`${api.baseURL}/ciclos`, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'x-access-token': getToken()
					},
					body: JSON.stringify({
						nome: nomeCiclo + mesEAnoCiclo
					}),
				});

				const data = await response.json();
				console.log(data)

				if (data.status === 200) {
					this.listaCiclos(getToken());
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

	listaCiclos = async (token) => {
		try {
			const response = await fetch(`${api.baseURL}/ciclos`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': token,
				},
			});

			const data = await response.json();

			if (data.status === 200) {
				this.setState({ arrayCiclos: data.resultados });
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

	carregarArquivoListaAlunos = (e) => {
		e.preventDefault();
		if (e.target.files) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = e.target.result;
				const workbook = xlsx.read(data, { type: "array", cellDates: true, });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const json = xlsx.utils.sheet_to_json(worksheet);
				this.setState({ arquivoListaAlunos: json });
				this.cadastrarListaDeAlunos(getToken());
				console.log(json);
			};
			reader.readAsArrayBuffer(e.target.files[0]);
		}
	}

	exportarTabelaParaXlsx = (csvData, fileName) => {

		const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const fileExtension = '.xlsx';

		const worksheet = xlsx.utils.json_to_sheet(csvData);
		const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileName + fileExtension);
	}

	cadastrarListaDeAlunos = async (token) => {
		console.log(token)
		try {
			const response = await fetch(`${api.baseURL}/alunos`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': token
				},
				body: JSON.stringify({
					alunos: this.state.arquivoListaAlunos,
					id_ciclo: this.state.id_ciclo
				}),
			});

			const data = await response.json();
			console.log(data)

			if (data.status === 200) {
				this.setState({ success: data.msg });
				this.listaDeAlunosPorCiclos(getToken(), this.state.id_ciclo);
				this.setState({ displaySpinner: 'none' })
			}

			if (data.status === 400) {
				this.setState({ error: data.msg });
			}
		} catch (error) {
			this.setState({ error: 'Ocorreu um erro' });
		}
	}

	listaDeAlunosPorCiclos = async (token, idCiclo = "") => {
		console.log(idCiclo)
		try {
			const response = await fetch(
				`${api.baseURL}/ciclos/${token}/alunos?idCiclo=${idCiclo}`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'x-access-token': token,
					},
				}
			);

			const data = await response.json();

			if (data.status === 200) {
				this.setState({ listaAlunosCheckList: data.resultados, listaAlunosEPendencias: data.resultados, success: data.msg });
				this.analisePendencias(data.resultados);
			}

			console.log(data);
		} catch (error) {
			console.log(error);
		}

	};

	listaDePendenciasPorCiclos = async (token, idCiclo = "") => {
		console.log(idCiclo)
		try {
			const response = await fetch(
				`${api.baseURL}/ciclos/${token}/pendencias?idCiclo=${idCiclo}`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'x-access-token': token,
					},
				}
			);

			const data = await response.json();

			if (data.status === 200) {
				this.setState({ listaPendenciasDoCiclo: data.resultados });
			}

			console.log(data);
		} catch (error) {
			console.log(error);
		}

	};

	checkedEtapaAtualDoProcessoDeCertificacaoDoAluno = async (id_aluno, checked, value) => {
		this.setState({ checked: checked })
		try {
			const response = await fetch(`${api.baseURL}/alunos/${id_aluno}`, {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': getToken(),
				},
				body: JSON.stringify({
					id_ciclo: this.state.id_ciclo,
					id_aluno,
					checked,
					value
				}),
			});

			const data = await response.json();
			console.log(data)

			if (parseInt(data.status) === 200) {
				this.listaDeAlunosPorCiclos(getToken(), this.state.id_ciclo);
				this.setState({ success: data.msg });
			}

			if (parseInt(data.status) === 400) {
				this.setState({ error: data.msg });
			}
		} catch (error) {
			console.log(error);
		}
	}

	AtualizarAluno = async (e) => {
		e.preventDefault();
		this.setState({ success: '', error: '' });
		const id_aluno = this.state.id_aluno;
		const observacao = this.state.observacao;
		try {
			const response = await fetch(`${api.baseURL}/alunos/${id_aluno}`, {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': getToken(),
				},
				body: JSON.stringify({
					id_ciclo: this.state.id_ciclo,
					id_aluno: id_aluno,
					observacao,
					checked: '',
					value: 0
				}),
			});

			const data = await response.json();
			console.log(data)

			if (parseInt(data.status) === 200) {
				this.listaDeAlunosPorCiclos(getToken(), this.state.id_ciclo);
				this.setState({ success: data.msg });
			}

			if (parseInt(data.status) === 400) {
				this.setState({ error: data.msg });
			}
		} catch (error) {
			console.log(error);
		}
	}

	cadastrarPendencia = async (e) => {
		e.preventDefault();
		this.setState({ success: '', error: '' });
		const nomePendencia = this.state.nomePendencia
		if (!nomePendencia) {
			this.setState({ error: 'Por favor, preencher todos os campos.' });
		} else {
			try {
				const response = await fetch(`${api.baseURL}/pendencias`, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'x-access-token': getToken()
					},
					body: JSON.stringify({
						nome: nomePendencia.toLocaleUpperCase()
					}),
				});

				const data = await response.json();
				console.log(data)

				if (data.status === 200) {
					this.setState({ success: data.msg });
					this.listaPendencias(getToken());
				}

				if (data.status === 400) {
					this.setState({ error: data.msg });
				}
			} catch (error) {
				this.setState({ error: 'Ocorreu um erro' });
			}
		}
	};

	listaPendencias = async (token) => {
		try {
			const response = await fetch(`${api.baseURL}/pendencias`, {
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
				this.setState({ listaPendencias: data.resultados });
			}

			if (data.permissoes === false) {
				logout();
				this.props.history.push("/");
			}

		} catch (error) {
			console.log(error);
		}
	};

	listaPendenciasDoAluno = async (token, idAluno) => {
		try {
			const response = await fetch(`${api.baseURL}/alunos/${token}/pendencias?idAluno=${idAluno}`, {
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
				this.setState({ listaPendenciasDoAluno: data.resultados });
			}

			if (data.permissoes === false) {
				logout();
				this.props.history.push("/");
			}

		} catch (error) {
			console.log(error);
		}
	};


	analisePendencias(listaAlunosEPendencias) {
		let contadorPendencias = 0;
		let pendencia = 0;
		let tipoPendencia = '';
		let arrayAlunosPendencias = [];
		let arrayIdsAlunosPendentes = [];
		let arrayIdsPendenciasEncontradas = []
		let listaPendencias = this.state.listaPendencias;

		listaAlunosEPendencias.map(aluno => {
			if (aluno.nome === "") {
				contadorPendencias += 1;
				console.log(`O aluno ${aluno.nome} possui uma pendência de falta de cpf.`);
				tipoPendencia = 'NOME ESTÁ FALTANDO';
				pendencia = listaPendencias.find((pendencia) => pendencia.nome === tipoPendencia ? pendencia : 0);
				for (let index = 0; index < arrayAlunosPendencias.length; index++) {
					console.log(JSON.stringify(arrayAlunosPendencias[index]) !== JSON.stringify([aluno.id_alunoG, pendencia.id]));
					if (JSON.stringify(arrayAlunosPendencias[index]) === JSON.stringify([aluno.id_alunoG, pendencia.id])) {
						return;
					}
				}
				arrayAlunosPendencias.push([aluno.id_alunoG, pendencia.id]);
				arrayIdsAlunosPendentes.push(`${aluno.id_alunoG}`);
				arrayIdsPendenciasEncontradas.push(`${pendencia.id}`);
			}

			if (aluno.dataNascimento === "") {
				contadorPendencias += 1;
				console.log(`O aluno ${aluno.nome} possui uma pendência de falta de data de nascimento.`);
				tipoPendencia = 'DATA DE NASCIMENTO ESTÁ FALTANDO';
				pendencia = listaPendencias.find((pendencia) => pendencia.nome === tipoPendencia ? pendencia : 0);
				for (let index = 0; index < arrayAlunosPendencias.length; index++) {
					console.log(JSON.stringify(arrayAlunosPendencias[index]) !== JSON.stringify([aluno.id_alunoG, pendencia.id]));
					if (JSON.stringify(arrayAlunosPendencias[index]) === JSON.stringify([aluno.id_alunoG, pendencia.id])) {
						return;
					}
				}
				arrayAlunosPendencias.push([aluno.id_alunoG, pendencia.id]);
				arrayIdsAlunosPendentes.push(`${aluno.id_alunoG}`);
				arrayIdsPendenciasEncontradas.push(`${pendencia.id}`);
			}

			if (aluno.rg === "") {
				contadorPendencias += 1;
				console.log(`O aluno ${aluno.nome} possui uma pendência de falta de RG.`);
				tipoPendencia = 'RG ESTÁ FALTANDO';
				pendencia = listaPendencias.find((pendencia) => pendencia.nome === tipoPendencia ? pendencia : 0);
				for (let index = 0; index < arrayAlunosPendencias.length; index++) {
					console.log(JSON.stringify(arrayAlunosPendencias[index]) !== JSON.stringify([aluno.id_alunoG, pendencia.id]));
					if (JSON.stringify(arrayAlunosPendencias[index]) === JSON.stringify([aluno.id_alunoG, pendencia.id])) {
						return;
					}
				}
				arrayAlunosPendencias.push([aluno.id_alunoG, pendencia.id]);
				arrayIdsAlunosPendentes.push(`${aluno.id_alunoG}`);
				arrayIdsPendenciasEncontradas.push(`${pendencia.id}`)
			}

			if (aluno.cpf === "") {
				contadorPendencias += 1;
				console.log(`O aluno ${aluno.nome} possui uma pendência de falta de CPF.`);
				tipoPendencia = 'CPF ESTÁ FALTANDO';
				pendencia = listaPendencias.find((pendencia) => pendencia.nome === tipoPendencia ? pendencia : 0);
				for (let index = 0; index < arrayAlunosPendencias.length; index++) {
					console.log(JSON.stringify(arrayAlunosPendencias[index]) !== JSON.stringify([aluno.id_alunoG, pendencia.id]));
					if (JSON.stringify(arrayAlunosPendencias[index]) === JSON.stringify([aluno.id_alunoG, pendencia.id])) {
						return;
					}
				}
				arrayAlunosPendencias.push([aluno.id_alunoG, pendencia.id]);
				arrayIdsAlunosPendentes.push(`${aluno.id_alunoG}`);
				arrayIdsPendenciasEncontradas.push(`${pendencia.id}`);
			}

			if (aluno.naturalidade === "" || aluno.situacaoTurma === "" || aluno.turma === "" || aluno.nomeInstituicao === "") {
				contadorPendencias += 1;
				console.log(`O aluno ${aluno.nome} possui uma pendência de falta de NATURALIDADE.`);
				tipoPendencia = 'NATURALIDADE ESTÁ FALTANDO';
				pendencia = listaPendencias.find((pendencia) => pendencia.nome === tipoPendencia ? pendencia : 0);
				for (let index = 0; index < arrayAlunosPendencias.length; index++) {
					console.log(JSON.stringify(arrayAlunosPendencias[index]) !== JSON.stringify([aluno.id_alunoG, pendencia.id]));
					if (JSON.stringify(arrayAlunosPendencias[index]) === JSON.stringify([aluno.id_alunoG, pendencia.id])) {
						return;
					}
				}
				arrayAlunosPendencias.push([aluno.id_alunoG, pendencia.id]);
				arrayIdsAlunosPendentes.push(`${aluno.id_alunoG}`);
				arrayIdsPendenciasEncontradas.push(`${pendencia.id}`);
			}

			if (aluno.turma === "") {
				contadorPendencias += 1;
				console.log(`O aluno ${aluno.nome} possui uma pendência de falta de TURMA.`);
				tipoPendencia = 'TURMA ESTÁ FALTADO';
				pendencia = listaPendencias.find((pendencia) => pendencia.nome === tipoPendencia ? pendencia : 0);
				for (let index = 0; index < arrayAlunosPendencias.length; index++) {
					console.log(JSON.stringify(arrayAlunosPendencias[index]) !== JSON.stringify([aluno.id_alunoG, pendencia.id]));
					if (JSON.stringify(arrayAlunosPendencias[index]) === JSON.stringify([aluno.id_alunoG, pendencia.id])) {
						return;
					}
				}
				arrayAlunosPendencias.push([aluno.id_alunoG, pendencia.id]);
				arrayIdsAlunosPendentes.push(`${aluno.id_alunoG}`);
				arrayIdsPendenciasEncontradas.push(`${pendencia.id}`);
			}

			if (aluno.nomeInstituicao === "") {
				contadorPendencias += 1;
				console.log(`O aluno ${aluno.nome} possui uma pendência de falta de instituição.`);
				tipoPendencia = 'INSTITUIÇÃO ESTÁ FALTANDO';
				pendencia = listaPendencias.find((pendencia) => pendencia.nome === tipoPendencia ? pendencia : 0);
				for (let index = 0; index < arrayAlunosPendencias.length; index++) {
					console.log(JSON.stringify(arrayAlunosPendencias[index]) !== JSON.stringify([aluno.id_alunoG, pendencia.id]));
					if (JSON.stringify(arrayAlunosPendencias[index]) === JSON.stringify([aluno.id_alunoG, pendencia.id])) {
						return;
					}
				}
				arrayAlunosPendencias.push([aluno.id_alunoG, pendencia.id]);
				arrayIdsAlunosPendentes.push(`${aluno.id_alunoG}`);
				arrayIdsPendenciasEncontradas.push(`${pendencia.id}`);
			}


			if (aluno.pai === "" && aluno.mae === "") {
				contadorPendencias += 1;
				console.log(`O aluno ${aluno.nome} possui uma pendência de falta de responsáveis.`);
				tipoPendencia = 'FALTA DE RESPONSÁVEIS';
				pendencia = listaPendencias.find((pendencia) => pendencia.nome === tipoPendencia ? pendencia : 0);

				for (let index = 0; index < arrayAlunosPendencias.length; index++) {
					console.log(JSON.stringify(arrayAlunosPendencias[index]) !== JSON.stringify([aluno.id_alunoG, pendencia.id]));
					if (JSON.stringify(arrayAlunosPendencias[index]) === JSON.stringify([aluno.id_alunoG, pendencia.id])) {
						return
					}
				}
				arrayAlunosPendencias.push([aluno.id_alunoG, pendencia.id]);
				arrayIdsAlunosPendentes.push(`${aluno.id_alunoG}`);
				arrayIdsPendenciasEncontradas.push(`${pendencia.id}`);
			}

			if (aluno.situacaoTurma !== "FINALIZADO") {
				contadorPendencias += 1;
				console.log(`O aluno ${aluno.nome} possui uma pendência de situação do aluno: ${aluno.situacaoTurma}.`);
				tipoPendencia = 'O ALUNO ESTÁ CURSANDO OU POSSUI UMA SITUAÇÃO DIFERENTE DE FINALIZADO';
				pendencia = listaPendencias.find((pendencia) => pendencia.nome === tipoPendencia ? pendencia : 0);
				for (let index = 0; index < arrayAlunosPendencias.length; index++) {
					console.log(JSON.stringify(arrayAlunosPendencias[index]) !== JSON.stringify([aluno.id_alunoG, pendencia.id]));
					if (JSON.stringify(arrayAlunosPendencias[index]) === JSON.stringify([aluno.id_alunoG, pendencia.id])) {
						return
					}
				}
				arrayAlunosPendencias.push([aluno.id_alunoG, pendencia.id]);
				arrayIdsAlunosPendentes.push(`${aluno.id_alunoG}`);
				arrayIdsPendenciasEncontradas.push(`${pendencia.id}`)
			}
		})

		this.registrarPendenciasDoAluno(arrayAlunosPendencias, arrayIdsAlunosPendentes, getToken());
		this.setState({ arrayAlunosPendencias: arrayAlunosPendencias });

	}

	registrarPendenciasDoAluno = async (arrayAlunosPendencias, arrayIdsAlunosPendentes, token) => {
		console.log(arrayAlunosPendencias);

		try {
			const response = await fetch(`${api.baseURL}/alunos/${token}/pendencias`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': getToken()
				},
				body: JSON.stringify({
					arrayAlunosPendencias,
					arrayIdsAlunosPendentes
				}),
			});

			const data = await response.json();
			console.log(data);

			if (data.status === 200) {
				this.setState({ success: data.msg });
				this.listaPendenciasDoAluno(getToken(), this.state.id_aluno);
			}
		} catch (error) {
			this.setState({ error: 'Ocorreu um erro' });
		}
	}

	render() {

		const ciclos = this.state.arrayCiclos;
		const listaAlunosCheckList = this.state.listaAlunosCheckList;
		const listaAlunosEPendencias = this.state.listaAlunosEPendencias;
		const pendencias = this.state.listaPendencias;
		const listaPendenciasDoAluno = this.state.listaPendenciasDoAluno;
		const listaPendenciasDoCiclo = this.state.listaPendenciasDoCiclo;

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
								<div className="col-sm-7 border-right border-dark">
									<div className="row">
										<div className="col-sm-9">
											<h3 className='titulo'><FaRedo /> Ciclos - Etapa Inicial da Certificação</h3>
										</div>
										<div className="col-sm-3 align-right">
											<button className='button' onClick={() => this.handlerShowModalCadastrarCiclo()}>Novo Ciclo</button>
										</div>

									</div>
									<hr />
									<div className="table-responsive">
										<div class="table-responsive-lg">
											<table className="table table-bordered table-hover">
												<thead class="thead-light">
													<tr>
														<th scope="col">Id</th>
														<th scope="col">ciclo</th>
														<th scope="col">Data e hora de Cad.</th>
														<th scope="col">Ações</th>
													</tr>
												</thead>
												<tbody>
													{ciclos.length > 0 ? (
														ciclos.map(ciclo => (
															<tr key={ciclo.id} onClick={() => this.handlerShowModalEditarCiclo(ciclo)} title="Clique aqui para obter mais informações sobre o ciclo">
																<td>{ciclo.id}</td>
																<td>{ciclo.nome}</td>
																<td>{ciclo.dataHoraCriacao}</td>
																<td><FaTrashAlt/></td>
															</tr>
														))
													) : (<tr className="text-center">
														<td colSpan="10">
															Nenhuma ciclo encontrado
														</td>
													</tr>)}
												</tbody>
											</table>
										</div>
									</div>
									{
										<div className="text-center font-weight-bold mt-3 mb-5">
											Total de Registros: {ciclos.length}
										</div>
									}

									{/* /.row */}
								</div>
								<div className="col-sm-5">
									<div className="row">
										<div className="col-sm-7">
											<h3 className='titulo'><FaExclamationTriangle /> Pendências</h3>
										</div>
										<div className="col-sm-5 align-right">
											<button className='button' onClick={() => this.handlerShowModalCadastrarPendencia()}>Nova Pendência</button>
										</div>
									</div>
									<hr />
									<div className="table-responsive">
										<div class="table-responsive-lg">
											<table className="table table-bordered table-hover">
												<thead class="thead-light">
													<tr>
														<th scope="col">Id</th>
														<th scope="col">Pendência</th>
														<th scope="col">Data e hora de Cad.</th>
													</tr>
												</thead>
												<tbody>
													{pendencias.length > 0 ? (
														pendencias.map(pendencia => (
															<tr key={pendencia.id} title="Clique aqui para obter mais informações sobre a pendência">
																<td>{pendencia.id}</td>
																<td>{pendencia.nome}</td>
																<td>{pendencia.dataHoraCriacao}</td>
															</tr>
														))
													) : (<tr className="text-center">
														<td colSpan="10">
															Nenhuma ciclo encontrado
														</td>
													</tr>)}
												</tbody>
											</table>
										</div>
									</div>
									{
										<div className="text-center font-weight-bold mt-3 mb-5">
											Total de Registros: {pendencias.length}
										</div>
									}

									{/* /.row */}
									<hr />
								</div>
							</div>
							{/* <Tabs
								variant="pills"
								defaultActiveKey="ciclos"
								transition={false}
								id="panel-admin"
								className="justify-content-center"
							>

								<Tab
									eventKey="ciclos"
									title="Ciclos"
									style={{ marginTop: '30px' }}

								>

								</Tab>

								<Tab
									eventKey="pendencias_gerais"
									title="Pendências Gerais"
									style={{ marginTop: '30px' }}
								>

									<hr />
								</Tab>
							</Tabs> */}

						</div>
						{/* /.container-fluid */}
					</div>
					{/* /.content */}
					<br />
				</div>
				<Modal
					show={this.state.modalShowCadastrarPendencia}
					onHide={() => this.handlerCloseModalCadastrarPendencia()}
					aria-labelledby="contained-modal-title-vcenter"
					backdrop="static"
					centered
				>
					<Form onSubmit={this.cadastrarPendencia}>
						<Modal.Header closeButton>
							<Modal.Title id="contained-modal-title-vcenter" >
								<h3 className='titulo'><FaRegWindowClose /> Registrar uma nova pendência</h3>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div className="row text-center border-bottom">
								<div className="col-md-12">
									<div className="form-group">
										<input class="form-control" type="text" id="inputNomePendencia" name="start"
											value={this.state.nomePendencia}
											onChange={e => this.setState({ nomePendencia: e.target.value })}
										/>
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
							<button className='btn btn-outline-primary'>SIM</button>
						</Modal.Footer>
					</Form>
				</Modal>

				<Modal
					show={this.state.modalShowEditarAluno}
					onHide={() => this.handlerCloseModalEditarAluno()}
					aria-labelledby="contained-modal-title-vcenter"
					backdrop="static"
					size="lg"
					centered
				>
					<Form onSubmit={this.cadastrarPendencia}>
						<Modal.Header closeButton>
							<Modal.Title id="contained-modal-title-vcenter" className='text-center'>
								Informações do aluno
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div className="row text-center border-bottom">
								<div className="col-md-12">
									<div className="form-group">
										<input class="form-control" type="text" id="inputNomePendencia" name="start"
											value={this.state.nomePendencia}
											onChange={e => this.setState({ nomePendencia: e.target.value })}
										/>
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
							<hr />

							<h3 className='titulo'>Lista de pendências do aluno</h3>
							<hr />
							<div className="table-responsive">
								<div class="table-responsive-lg">
									<table className="table table-bordered table-hover">
										<thead class="thead-light">
											<tr>
												<th scope="col">Id</th>
												<th scope="col">Pendência</th>
												<th scope="col">Data e hora de Cad.</th>
											</tr>
										</thead>
										<tbody>
											{listaPendenciasDoAluno.length > 0 ? (
												listaPendenciasDoAluno.map(pendencia => (
													<tr key={pendencia.id_pendencia}>
														<td>{pendencia.id_pendencia}</td>
														<td>{pendencia.pendencia}</td>
														<td>{pendencia.dataHoraCriacao}</td>
													</tr>
												))
											) : (<tr className="text-center">
												<td colSpan="10">
													<Spinner animation="border" />
												</td>
											</tr>)}
										</tbody>
									</table>
								</div>
							</div>
							{
								<div className="text-center font-weight-bold mt-3 mb-5">
									Total de Registros:
								</div>
							}
						</Modal.Body>

					</Form>
				</Modal>

				<Modal
					show={this.state.modalShowCadastrarCiclo}
					onHide={() => this.handlerCloseModalCadastrarCiclo()}
					aria-labelledby="contained-modal-title-vcenter"
					backdrop="static"
					centered
				>
					<Form onSubmit={this.cadastrarCiclo}>
						<Modal.Header closeButton>
							<Modal.Title id="contained-modal-title-vcenter" className='text-center'>
								<FaCalendarWeek /> Selecione o mês do ciclo
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div className="row text-center border-bottom">
								<div className="col-md-12">
									<div className="form-group">

										<input class="form-control" type="month" id="inputMesEAno" name="start"
											min="2022-01" value={this.state.mesEAnoCiclo}
											onChange={e => this.setState({ mesEAnoCiclo: e.target.value })}
										/>
									</div>
								</div>
							</div>

							<div className="row text-center">
								<div className="col-md-12">
									<p>Tem certeza que deseja criar um novo ciclo ?</p>
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
							<button className='btn btn-outline-primary'>SIM</button>
						</Modal.Footer>
					</Form>
				</Modal>

				<Modal
					show={this.state.modalShowEditarCiclo}
					onHide={() => this.handlerCloseModalEditarCiclo()}
					aria-labelledby="contained-modal-title-vcenter"
					backdrop="static"
					className='modal-fullscreen'
				>

					<Modal.Header closeButton>
						<Modal.Title>
							<h2 className='titulo'><FaCalendarWeek /> Processo de Certificação - {this.state.nomeCiclo}</h2>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Accordion>
							<Card>
								<Accordion.Toggle as={Card.Header} eventKey="0">
									<h3 className='titulo'><FaUserGraduate /> Etapa de Checklist </h3>
								</Accordion.Toggle>

								<Accordion.Collapse eventKey="0">
									<Card.Body>
										<div className="table-responsive table-sm">
											<div class="table-responsive-lg">
												<table className="table table-bordered table-hover">
													<thead class="thead-light">
														<tr>
															<th scope="col">Id</th>
															<th scope="col">Nome</th>
															<th scope="col">Observação</th>
															<th scope="col">Turma</th>
															<th scope="col">Instituição</th>
															<th scope="col">Certificado Impresso</th>
															<th scope="col">Declaração Impressa</th>
															<th scope="col">Carimbos</th>
															<th scope="col">Selo</th>
															<th scope="col">Assinaturas</th>
															<th scope="col">Lista Impresso</th>
															<th scope="col">Etiqueta Impressa</th>
															<th scope="col">código de Rastreio</th>
															<th scope="col">Sedex ?</th>
														</tr>
													</thead>
													<tbody>

														{listaAlunosCheckList.length > 0 ? (
															listaAlunosCheckList.map(aluno => (
																<tr key={aluno.id_alunoCertificacao}>
																	<td>{aluno.id_alunoCertificacao}</td>
																	<td>{aluno.nome}</td>
																	<td>{aluno.observacao === "0" ? <button className='button' onClick={() => this.handlerShowModalAdicionarObservacao(aluno)}>Registrar</button> : aluno.observacao}</td>
																	<td>{aluno.turma}</td>
																	<td>{aluno.nomeInstituicao}</td>
																	<td className='text-center'>
																		<div class="custom-control custom-checkbox">
																			<input type="checkbox" class="custom-control-input" id={"checkCertificadoImp_" + aluno.id} value={aluno.certificado_imp === 0 ? 1 : 0} checked={aluno.certificado_imp === 1} onChange={e => this.checkedEtapaAtualDoProcessoDeCertificacaoDoAluno(aluno.id_alunoCertificacao, 'certificado_imp', e.target.value)} />
																			<label class="custom-control-label" for={"checkCertificadoImp_" + aluno.id}></label>
																		</div>
																	</td>

																	<td className='text-center'>
																		<div class="custom-control custom-checkbox">
																			<input type="checkbox" class="custom-control-input" id={"checkDeclaracaoImp_" + aluno.id} value={aluno.declaracao_imp === 0 ? 1 : 0} checked={aluno.declaracao_imp === 1} onChange={e => this.checkedEtapaAtualDoProcessoDeCertificacaoDoAluno(aluno.id_alunoCertificacao, 'declaracao_imp', e.target.value)} />
																			<label class="custom-control-label" for={"checkDeclaracaoImp_" + aluno.id}></label>
																		</div>
																	</td>

																	<td className='text-center'>
																		<div class="custom-control custom-checkbox">
																			<input type="checkbox" class="custom-control-input" id={"checkCarimbos_" + aluno.id} value={aluno.carimbos === 0 ? 1 : 0} checked={aluno.carimbos === 1} onChange={e => this.checkedEtapaAtualDoProcessoDeCertificacaoDoAluno(aluno.id_alunoCertificacao, 'carimbos', e.target.value)} />
																			<label class="custom-control-label" for={"checkCarimbos_" + aluno.id}></label>
																		</div>
																	</td>

																	<td className='text-center'>
																		<div class="custom-control custom-checkbox">
																			<input type="checkbox" class="custom-control-input" id={"checkSelo_" + aluno.id} value={aluno.selo === 0 ? 1 : 0} checked={aluno.selo === 1} onChange={e => this.checkedEtapaAtualDoProcessoDeCertificacaoDoAluno(aluno.id_alunoCertificacao, 'selo', e.target.value)} />
																			<label class="custom-control-label" for={"checkSelo_" + aluno.id}></label>
																		</div>
																	</td>

																	<td className='text-center'>
																		<div class="custom-control custom-checkbox">
																			<input type="checkbox" class="custom-control-input" id={"checkAssinaturas_" + aluno.id} value={aluno.assinaturas === 0 ? 1 : 0} checked={aluno.assinaturas === 1} onChange={e => this.checkedEtapaAtualDoProcessoDeCertificacaoDoAluno(aluno.id_alunoCertificacao, 'assinaturas', e.target.value)} />
																			<label class="custom-control-label" for={"checkAssinaturas_" + aluno.id}></label>
																		</div>
																	</td>

																	<td className='text-center'>
																		<div class="custom-control custom-checkbox">
																			<input type="checkbox" class="custom-control-input" id={"checkListaImpresso_" + aluno.id} value={aluno.listaImpresso === 0 ? 1 : 0} checked={aluno.listaImpresso === 1} onChange={e => this.checkedEtapaAtualDoProcessoDeCertificacaoDoAluno(aluno.id_alunoCertificacao, 'listaImpresso', e.target.value)} />
																			<label class="custom-control-label" for={"checkListaImpresso_" + aluno.id}></label>
																		</div>
																	</td>

																	<td className='text-center'>
																		<div class="custom-control custom-checkbox">
																			<input type="checkbox" class="custom-control-input" id={"checkEtiquetaImpresso_" + aluno.id} value={aluno.etiquetaImpresso === 0 ? 1 : 0} checked={aluno.etiquetaImpresso === 1} onChange={e => this.checkedEtapaAtualDoProcessoDeCertificacaoDoAluno(aluno.id_alunoCertificacao, 'etiquetaImpresso', e.target.value)} />
																			<label class="custom-control-label" for={"checkEtiquetaImpresso_" + aluno.id}></label>
																		</div>
																	</td>

																	<td className='text-center'>
																		0000
																	</td>

																	<td className='text-center'>
																		<div class="custom-control custom-checkbox">
																			<input type="checkbox" class="custom-control-input" id={"checkEtiquetaImpresso_" + aluno.id} value={aluno.etiquetaImpresso === 0 ? 1 : 0} checked={aluno.etiquetaImpresso === 1} onChange={e => this.checkedEtapaAtualDoProcessoDeCertificacaoDoAluno(aluno.id_alunoCertificacao, 'etiquetaImpresso', e.target.value)} />
																			<label class="custom-control-label" for={"checkEtiquetaImpresso_" + aluno.id}></label>
																		</div>
																	</td>

																</tr>

															))
														) : (<tr className="text-center">
															<td colSpan="15">
																<Spinner animation="border" />
															</td>
														</tr>)}

														{/* {<div>{JSON.stringify(this.state.arquivoListaAlunos)}</div>} */}
													</tbody>
												</table>
											</div>
										</div>
										{
											<div className="text-center font-weight-bold mt-3 mb-5">
												Total de Registros: {listaAlunosCheckList.length}
											</div>
										}
									</Card.Body>
								</Accordion.Collapse>
							</Card>

							<Card>
								<Accordion.Toggle as={Card.Header} eventKey="1">

									<div class="row">
										<div class="col-md-9">
											<h3 className='titulo'><FaBuromobelexperte /> Lista de Alunos e Pendências</h3>
										</div>
										<div class="col-md-3">
											<form>
												<div class="custom-file">

													<input
														type="file"
														name="upload"
														id="upload"
														class="custom-file-input"
														onChange={this.carregarArquivoListaAlunos}
													/>
													<label class="custom-file-label" for="customFileLang">Carregar lista de alunos</label>
												</div>
											</form>
										</div>

									</div>
								</Accordion.Toggle>

								<Accordion.Collapse eventKey="1">
									<Card.Body>
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

										<div className="table-responsive table-sm">
											<div class="table-responsive-lg">
												<table className="table table-bordered table-hover">
													<thead class="thead-light">
														<tr>
															<th scope="col">Nome</th>
															<th>Data de Nascimento</th>
															<th scope="col">RG</th>
															<th scope="col">CPF</th>
															<th scope="col">Naturalidade</th>
															<th>Nome do Pai</th>
															<th>Nome da mãe</th>
															<th scope="col">Situação do Aluno</th>
															<th scope="col">Turma</th>
															<th scope="col">Instituição</th>
														</tr>
													</thead>
													<tbody>
														{listaAlunosEPendencias.length > 0 ?
															listaAlunosEPendencias.map(aluno => (
																<tr key={aluno.id}
																	className={aluno.nome === "" || aluno.dataNascimento === "" || aluno.rg === "" ||
																		aluno.cpf === "" || aluno.naturalidade === "" || aluno.situacaoTurma === "" ||
																		aluno.turma === "" || aluno.nomeInstituicao === ""
																		|| aluno.pai === "" && aluno.mae === "" || aluno.situacaoTurma !== "FINALIZADO"
																		? `table-danger` : ``}
																	onClick={() => this.handlerShowModalEditarAluno(aluno)}>

																	<td>{aluno.nome}</td>
																	<td>{aluno.dataNascimento}</td>
																	<td>{aluno.rg}</td>
																	<td>{aluno.cpf}</td>
																	<td>{aluno.naturalidade}</td>
																	<td>{aluno.pai}</td>
																	<td>{aluno.mae}</td>
																	<td>{aluno.situacaoTurma}</td>
																	<td>{aluno.turma}</td>
																	<td>{aluno.nomeInstituicao}</td>
																</tr>)
															) : (<tr className="text-center">
																<td colSpan="15">
																	<Spinner animation="border" />
																</td>
															</tr>)}

													</tbody>
												</table>
											</div>
										</div>
										{
											<div className="text-center font-weight-bold mt-3 mb-5">
												Total de Registros: {listaAlunosEPendencias.length}
											</div>
										}
									</Card.Body>
								</Accordion.Collapse>
							</Card>

							<Card>
								<Accordion.Toggle as={Card.Header} eventKey="2">
									<div className="d-flex">
										<div>
											<h3 className='titulo'><FaUserGraduate /> Lista de Pendências do Ciclo </h3>
										</div>
										<div className="ml-auto">
											<ReactToPrint
												trigger={() => {
													// NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
													// to the root node of the returned component as it will be overwritten.
													return <a href="#" className='button'><FaPrint /></a>;
												}}
												content={() => this.componentRef}
											/>

											<button className='button' onClick={() => this.exportarTabelaParaXlsx(listaPendenciasDoCiclo, "listaAlunosEPendencias")}><FaFileExport /></button>
										</div>
									</div>
								</Accordion.Toggle>

								<Accordion.Collapse eventKey="2">
									<Card.Body>
										<div className="table-responsive table-sm">
											<div class="table-responsive-lg">
												<table className="table table-bordered table-hover" ref={el => (this.componentRef = el)}>
													<thead class="thead-light">
														<tr>
															<th scope="col">Nome</th>
															<th>Pendências</th>
															<th>Instituição</th>
															<th scope="col">Data/hora de Criacão</th>
														</tr>
													</thead>
													<tbody>
														{listaPendenciasDoCiclo.length > 0 ?
															listaPendenciasDoCiclo.map(aluno => (
																<tr key={aluno.id_aluno}>
																	<td>{aluno.nome}</td>
																	<td>{aluno.pendencias}</td>
																	<td>{aluno.nomeInstituicao}</td>
																	<td>{aluno.dataHoraCriacao}</td>

																</tr>)
															) : (<tr className="text-center">
																<td colSpan="15">
																	<Spinner animation="border" />
																</td>
															</tr>)}

													</tbody>
												</table>
											</div>
										</div>
										{
											<div className="text-center font-weight-bold mt-3 mb-5">
												Total de Registros: {listaPendenciasDoCiclo.length}
											</div>
										}
									</Card.Body>
								</Accordion.Collapse>
							</Card>
						</Accordion>


						{/* <Tabs
							variant="pills"
							defaultActiveKey={this.state.keyTab}
							transition={false}
							id="panel-admin"
							className="justify-content-center"
						>
							<Tab
								eventKey="Checklist"
								title="Checklist de Certificação"
								style={{ marginTop: '30px' }}
							>

							</Tab>

							<Tab
								eventKey="AlunosEPendencias"
								title="Alunos e Pendências"
								style={{ marginTop: '30px' }}
							>

								<div className="row ">
									<div className="col-sm-8">

									</div>

								</div>
								<hr />



							</Tab>
						</Tabs> */}
					</Modal.Body>
				</Modal>

				<Modal
					show={this.state.modalShowAdicionarObservacao}
					onHide={() => this.handlerCloseModalAdicionarObservacao()}
					aria-labelledby="contained-modal-title-vcenter"
					backdrop="static"
					centered
				>
					<Form onSubmit={this.AtualizarAluno}>
						<Modal.Header closeButton>
							<Modal.Title id="contained-modal-title-vcenter" >
								<h3 className='titulo'><FaRegWindowClose /> Registrar observação para {this.state.nomeAluno}</h3>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div className="row text-center border-bottom">
								<div className="col-md-12">
									<div className="form-group">
										<input class="form-control" type="text" id="inputObservacao" name="start"
											value={this.state.observacao}
											onChange={e => this.setState({ observacao: e.target.value })}
										/>
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
							<button className='btn btn-outline-primary'>SIM</button>
						</Modal.Footer>
					</Form>
				</Modal>
			</Container >
		);
	}
}

export const Container = styled.div`
  width: 100%;
  height: 100vh;

  .titulo {
	color: #000233;
  }
`;

export const Form = styled.form`
	.titulo {
	color: #000233;
  }
`;
