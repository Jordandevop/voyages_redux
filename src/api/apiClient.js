// URL de base de l'api
const API_URL = "https://qyklv804.webmo.me/api"

export async function apiRequest(endpoint, options = {}) {

    //Récupérer le token JWT si il existe
    const token = localStorage.getItem("token")

    //Création des headers HTTP
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,

    }

    if(token) {
        // Certains hébergement web bloque le header Authorization
        // header.Authorization = `Bearer ${token}`

        //Solution alternative : header personnalisé

        headers['X-Auth-Token'] = token;
        // Le JWT ne change pas
        // Uniquement la façon de l'envoyer à l'API

        // Authorization  header HTTP standard
        // X-Auth-Token   header HTTP personnalisé
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        // Si la réponse HTTP indique une erreur, lancer une exception avec le message d'erreur de l'API
        throw new Error(data.message || "Une erreur est survenue.");
    }

    return data;

}