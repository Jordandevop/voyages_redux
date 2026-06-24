import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import authReducer from '../features/auth/authSlice';
import ProfilePage from "./ProfilePage";

function renderWithStore(authState, userState) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      users: () => userState,
    },
    preloadedState: {
      auth: authState,
    }
  });

  return {
     store,
    ...render(<Provider store={store}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </Provider>,)
  };
}

describe("ProfilePage", () => {
  test("clic sur Se déconnecter vide le user et le token", async () => {
    const userConnect = {
      user: { id: 1, username: "Jordan" },
      token: "fake-token",
    };

    const userState = {
      updateStatus: "waiting",
      updateError: null,

      passwordStatus: "waiting",
      passwordError: null,
    };

    const { store } = renderWithStore(userConnect, userState);


    const button = screen.getByRole("button", { name: "Se déconnecter" });

    const user = userEvent.setup();
    await user.click(button);

    const newState = store.getState().auth;
    
    expect(newState.user).toBeNull();
    expect(newState.token).toBeNull();
  });
});
