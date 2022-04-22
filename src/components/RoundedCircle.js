import React, { Component } from 'react';

import '../styles/App.css';

export default function RoundedCircle(props) {
  return (
    <div className="text-center">
      <div className="rounded-circle circulo-icon centralizar border">
        <i class={props.className}></i>
      </div>
      <h3 className="mt-12 mb-4">{props.titulo}</h3>
      <p className="lead">{props.descricao}</p>
    </div>
  );
};
