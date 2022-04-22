export const TOKEN_KEY = "@nexus-token";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
export const getToken = () => JSON.parse(localStorage.getItem(TOKEN_KEY));    

//Permissões do usuário
export const NEXUS_R = '@nexus-r';
export const setRole = (r) => localStorage.setItem(NEXUS_R, JSON.stringify(r));
export const getRole = () => JSON.parse(localStorage.getItem(NEXUS_R));

export const ROLES = {
    admin: 1,
    certificacao: 2
}


export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NEXUS_R);
}