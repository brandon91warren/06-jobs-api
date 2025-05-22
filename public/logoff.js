import { setToken, message, setDiv } from "./index.js";
import { showLoginRegister } from "./loginRegister.js";

export const logoff = () => {
  setToken(null);
  message.textContent = "You have been logged off.";
  showLoginRegister();
};
