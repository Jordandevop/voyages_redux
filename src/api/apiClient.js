// URL de base de l'api
const API_URL = "https://qyklv804.webmo.me/api"

export async function apiReequest(endpoint, options = {}) {

    //Récupérer le token JWT si il existe
    const token = localStorage.getItem("token")

    //Création des headers HTTP
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,

    }

    if(token) {
        
    }

}