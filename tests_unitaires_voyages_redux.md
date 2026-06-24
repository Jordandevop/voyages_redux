-------
- TESTS
-------

Mise en place de tests unitaires sur le projet Voyage-redux

Vitest pour exécuter les tests
React Testing Library pour tester les components
jsdom est une simulation de navigateur dans Node

npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

Mise en place des tests dans package.json
"script": {
    ...
    "test": "vitest",
    ...
}

vite.config.js:
export default defineConfig({
  plugins: [react()],
  test: (
    environment: 'jsdom', // vitest exécute les tests dans NodeJs
    setupFiles: './src/setupTests.js', // Fichier à exécuter avant chaque test
  )
})

- Créer ce fichier dans src/setupTests.js avec la ligne suivante :
import '@testing-library/jest-dom/vitest';
