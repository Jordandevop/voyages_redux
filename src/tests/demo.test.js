import { describe, test, beforeEach,expect } from 'vitest';

/*
Outils de test : 
import { describe, test, expect } from 'vitest';

describe : Permet de regrouper plusieurs tests
test : définit un test unitaire. Alias possible : it
test.only permet de ne tester que le test souhaiter et d'ignorer les autres test.only("", )
test.skip permet de passer le test et de tester seulement les autrestest.skip("", )
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

describe ('Premiers tests unitaires', () => { // on regroupe les tests
    test('Vérifie une addition', () => {
        const resultat = 2 + 3;

        expect(resultat).toBe(5); // vérifie le résultat
        // expect(10+4).toBe(14);
    });

    test('Verifie une soustraction', () => {
        expect(10-4).toBe(6);
    });

    test('Vérifie le contenu dun objet user',()=>{
        const user = {
            userName: 'Jordan',
            role: 'admin'
        }
        expect(user.userName).toBe('Jordan')
        expect(user.role).toBe('admin')
    });
    
    test('Vérifie la présence d\'une valeur dans un tableau', () => {
        const roles = ['admin', 'user']

        expect(roles).toContain('admin')
    });
    test('Compare deux tableaux', () => {
    const fruits = ['pomme', 'banane'];
    expect(fruits).toEqual(['pomme', 'banane']);
  });

  // --- toBeNull / toBeTruthy / toBeFalsy ---
  test('Vérifie une valeur null', () => {
    const valeur = null;
    expect(valeur).toBeNull();
  });

  test('Vérifie une valeur truthy', () => {
    expect('Jordan').toBeTruthy(); // string non vide = true
    expect(1).toBeTruthy();
  });
  test('Vérifie une valeur falsy', () => {
    expect('').toBeFalsy();  // string vide = false
    expect(0).toBeFalsy();
    expect(null).toBeFalsy();
  });

  // --- toContain : dans un tableau ou une string ---
  test('Vérifie qu\'un tableau contient une valeur', () => {
    const pays = ['France', 'Japon', 'Brésil'];
    expect(pays).toContain('Japon');
  });

  test('Vérifie qu\'une string contient un mot', () => {
    expect('Bonjour Jordan').toContain('Jordan');
  });

   // --- beforeEach : réinitialise avant chaque test ---
  let compteur;

  beforeEach(() => {
    compteur = 0; // repart à 0 avant chaque test
  });

  test('Le compteur démarre à 0', () => {
    expect(compteur).toBe(0);
  });

  test('Le compteur peut être incrémenté', () => {
    compteur++;
    expect(compteur).toBe(1);
  });
  });
