import { describe, test, beforeEach, expect } from "vitest";
import contactReducer, {
  sendMessage,
  fetchContacts,
  resetContactStatus,
} from "./contactSlice";

describe("contactSlice", () => {
  test("resetContatStatus vide le statut et l'erreur", () => {
    const initialstate = {
      contacts: ["antoine", "Jordan"],
      status: "error",
      error: "Une erreur",
    };

    const newState = contactReducer(initialstate, resetContactStatus());

    expect(newState.status).toBe('waiting');
    expect(newState.error).toBeNull();
  });

  test("sendMessage ,envoi du message avec succes ", () =>{
    const initialstate = {
      contacts: [],
      status: "pending",
      error: null,
    };

    const action = {
      type: sendMessage.fulfilled.type, 
    };
    const newState = contactReducer(initialstate, action);

    expect(newState.status).toBe("success"); 
  })

  test("sendMessage rejected , erreur envoi du message ", () =>{
    const initialstate = {
      contacts: [],
      status: "pending",
      error: null,
    };

    const action = {
      type: sendMessage.rejected.type, 
      payload: 'Erreur lors de l\'envoi du message'
    };
    const newState = contactReducer(initialstate, action);

    expect(newState.status).toBe("error"); 
    expect(newState.error).toBe('Erreur lors de l\'envoi du message');
  })
});
