import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { Provider } from "react-redux"; // besoin du store pendant les tests
import { configureStore } from "@reduxjs/toolkit"; // besoin du store pendant les tests
import { MemoryRouter, Routes, Route } from "react-router-dom"; // MemoryRouter sert à simuler le passage d'une page à une autre
import ProtectedRoute from "./ProtectedRoute"; // Le composant concerné par nos tests

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

function renderWithStore(authState) {
  const store = configureStore({
    // on simule le store redux

    reducer: {
      auth: () => authState,
    },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/profile"]}>
        {" "}
        {/* utilisateur essaie d'aller sur profile*/}
        <Routes>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <h1>Page Profile</h1>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<h1>Page login</h1>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe("Test ProtectedRoute", () => {

    beforeEach(()=>{
        cleanup();
    })
    test('Affiche la page profile si user est connecté', () => {
        //user connecté
        const userConnect = {
            user : {id : 1, username: 'Jordan'}, // on simule un user connecté
            token: 'fake-Token', // on simule un token
        };

        renderWithStore(userConnect);

        expect(screen.getByText('Page Profile')).toBeInTheDocument();
    })

    test('Affiche la page login si user est pas connecté', () =>{
        // user non connecté
         const userNotConnect = {
            user : null, 
            token: null, 
        };

        renderWithStore(userNotConnect);
        expect(screen.getByText('Page login')).toBeInTheDocument();

    })
    test('Affiche la page login si le token est absent', () =>{
        // Pas de token
        const userNotToken = {
            user : {id : 1, username: 'Jordan'},
            token : null,
        }
        renderWithStore(userNotToken);
        expect(screen.getByText('Page login')).toBeInTheDocument();
    })
});

