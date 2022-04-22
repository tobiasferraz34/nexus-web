import React from "react";

class Prova extends React.Component {
  render() {
    const prova = this.props.prova;
    return (

      <div className="page">
        <p><strong>Assinatura do Aluno:</strong>_____________________________________________________</p>
        <p><strong>Cpf:</strong> {this.props.cpf}</p>
        <p><strong>Nome:</strong> {this.props.nome}</p>
        <p><strong>Disciplina:</strong> {this.props.disciplina + " " + this.props.serie}</p>
        <p><strong>Nota:</strong>_____</p>
        <hr />
        {prova.length > 0 ? (

          prova.map((item, index) => (
            <div> 
              <p className='text-justify'>{index + 1} - {item.questao}</p>

              {item.alternativas.map(item => (
                 <p className='text-justify'>{item}</p>
              ))}
            </div>
          ))
        ) : (<p className='text-justify'>Nenhuma informação encontrada</p>)}
      </div>
    );
  }
}

export default Prova;