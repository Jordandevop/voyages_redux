import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

function renderWithStore(authState) {
  const store = configureStore({
    reducer: {
      auth: () => authState,
      theme: () => ({ mode: "light" }),
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>,
  );
}

describe("Test de la Navbar", () => {
  // visiteur

  test("visiteur  non connecté - liens visible", () => {
    const userNotConnect = {
      user: null,
      token: null,
    };

    renderWithStore(userNotConnect);

    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(screen.getByText("Inscription")).toBeInTheDocument();

    expect(screen.queryByText("Mon Profil")).not.toBeInTheDocument();
    expect(screen.queryByText("Favoris")).not.toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  test("visiteur connecté mais non Admin", () => {
    const userConnect = {
      user: { id: 1, username: "Jordan", role: "user" },
      token: "fake-token",
    };

    renderWithStore(userConnect);

    expect(screen.getByText("Mon Profil")).toBeInTheDocument();
    expect(screen.getByText("Favoris")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  test("visiteur connecté et admin", () => {
    const userAdmin = {
        user: { id: 1, username: "Jordan", role: "admin" },
      token: "fake-token",
    };

    renderWithStore(userAdmin);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  })
});
