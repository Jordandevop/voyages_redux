import { describe, test, beforeEach, expect } from "vitest";
import authReducer, { logout, loginUser } from "./authSlice"; // les outils que l'on va tester

/*
Outils de test : 
import { describe, test, expect } from 'vitest';

describe : Permet de regrouper plusieurs tests
test : définit un test unitaire. Alias possible : it
expect : permet de vérifier le résultat attendu
beforeEach : exécute du code avant chaque test

Autres outils disponibles :
afterEach : exécute du code après chaque test
beforeAll : exécute du code une seule fois avant les tests
afterAll : exécute du code une seule fois après les tests
...

Résultats :
toBe : comparaison stricte
toEqual : compare deux objets ou tableaux
toBeNull : la valeur doit être null
toBeTrusthy : la valeur doit être true
toBeFalsy : la valeur doit être false
toContain : doit contenir une valeur dans un tableau ou dans une chaine
...

Les outils React Testing library :
render : Afficher un component
screen : Permet de rechercher des éléments 
userEvent : Simule un comportement utilisateur
                await user.click(button)
...
*/

describe("authSlice", () => {
  beforeEach(() => {
    // avant chaque test
    localStorage.clear(); // on vide le storage
  });

  // on test logout
  test("logout vide le user, le token, le status et une erreur prtentielle", () => {
    const initialState = {
      user: { id: 1, username: "admin", role: "admin" },
      token: "123456",
      status: "success",
      error: "Erreur 123",
    };

    const newState = authReducer(initialState, logout());
    // newstate contient le résultat

    expect(newState.user).toBeNull();
    expect(newState.token).toBeNull();
    expect(newState.status).toBe("waiting");
    expect(newState.error).toBeNull();
  });

  test("Connexion utilisateur", () => {
    // Connexion réussie, Redux stocker les informations du user

    const initialState = {
      user: null,
      token: null,
      status: "waiting",
      error: null,
    }; // Pas de user connecté

    const user = {
      id: 1,
      username: "Jordan",
      role: "admin",
      accessToken: "fake-Token",
    }; // user fictif

    const action = {
      type: loginUser.fulfilled.type, // type : ce qu'il s'est passé
      payload: user,
    }; // action redux (loginUser.fulfilled = connexion réussie)

    const newState = authReducer(initialState, action);
    // initialState : état actuel
    // action : ce qu'il vient de se passer

    expect(newState.status).toBe("success"); // connexion réussie : le status doit être success
    expect(newState.user).toEqual(user); // les données utilisateurs doivent être srockées
    expect(newState.token).toBe("fake-Token"); // le token
  });

  // Mettre en place un test de connexion échouer
  // test.only permet de ne tester que le test souhaiter et d'ignorer les autres test.only("", )
  // test.skip permet de passer le test et de tester seulement les autrestest.skip("", )

  test("Connexion échoué", () => {
    const initialState = {
      user: null,
      token: null,
      status: "pending",
      error: null,
    };

    const action = {
        type : loginUser.rejected.type,
        payload: "Identifiants incorrects"
    };

    const newState = authReducer(initialState, action);

    expect(newState.status).toBe("error");
    expect(newState.error).toBe('Identifiants incorrects');
    // expect(newState.user).toBeNull(); // pas obligatoire
  });
});
