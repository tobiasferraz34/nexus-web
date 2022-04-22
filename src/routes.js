import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { isAuthenticated } from './services/auth';
import Login from './pages/login/index';
import Certificacao from './pages/certificacao';
import Provas from './pages/provas';
import PageNotFound from './components/PageNotFound';
import CadastrarFuncionario from './pages/cadastro_funcionario/index';
import CadastrarPolo from './pages/cadastro_polo/index';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        // Passando as propriedades para a rota
        {...rest}
        // Redefindo o método render 
        render={props =>
            //renderizando o componente caso o usuário esteja autenticado
            isAuthenticated() ? (<Component {...props} />
            ) : (
                    // caso contrário o usuário é redirecionado para a rota /
                    //state impede que o usuário não perca seu histórico de rotas
                    <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                )
        }
    />
);

const Routes = () => {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/criar_funcionario" component={CadastrarFuncionario} />
                    <Route path="/criar_polo" component={CadastrarPolo} />
                    <PrivateRoute path="/certificacao" component={Certificacao} />
                    <PrivateRoute path="/provas" component={Provas} />
                    <Route path="*" component={PageNotFound} />      
                </Switch>
            </BrowserRouter>
        );
} 

export default Routes;


