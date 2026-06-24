Tester contactSlice
-------------------
src/features/contact/contactSlice.test.js
- refaire la même logique que les tests de authSlice 

clearContactMessages() vide error
clearContactMessages() vide successMessage
sendContactRequest.fulfilled met status à "succeeded"
sendContactRequest.rejected met status à "failed"


Tester ProtectedRoute
---------------------
src/components/ProtectedRoute.test.jsx
- tester Redux + React Router.

token absent : redirige vers /login

Tester Navbar
-------------
src/components/Navbar.test.jsx
- tester l’affichage conditionnel selon l’état Redux.
Visiteur
    Connexion visible
    Inscription visible
    Profil absent
    Administration absent
Utilisateur connecté
    Profil visible
    Déconnexion visible
    Connexion absent
Admin
    Administration visible

Tester le clic sur Déconnexion
------------------------------
src/components/Navbar.test.jsx
- interaction utilisateur avec userEvent

clic sur Déconnexion
user devient null
token devient null
redirection vers /login