import React from 'react';


export default function ButtonComponent(props) {
  return (
    <button type="submit" className="button-salvar">
     {props.nome}
    </button>
  );
}