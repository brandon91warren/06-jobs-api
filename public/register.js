import {
  inputEnabled,
  setDiv,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showJobs } from "./jobs.js";

let registerDiv = null;
let registerButton = null;
let registerCancel = null;

export const handleRegister = () => {
  registerDiv = document.getElementById("register-div");
  registerButton = document.getElementById("register-button");
  registerCancel = document.getElementById("register-cancel");

  registerDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      // Always query inputs inside event handler to avoid stale references
      const nameInput = document.getElementById("register-name");
      const emailInput = document.getElementById("register-email");
      const passwordInput1 = document.getElementById("register-password");
      const passwordInput2 = document.getElementById("register-password2");

      if (!nameInput || !emailInput || !passwordInput1 || !passwordInput2) {
        message.textContent = "Form elements not found. Please refresh.";
        return;
      }

      if (e.target === registerButton) {
        if (passwordInput1.value !== passwordInput2.value) {
          message.textContent = "The passwords entered do not match.";
          return;
        }

        enableInput(false);
        message.textContent = "";

        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: nameInput.value,
              email: emailInput.value,
              password: passwordInput1.value,
            }),
          });

          const data = await response.json();

          if (response.status === 201) {
            message.textContent = `Registration successful. Welcome ${data.user.name}`;
            setToken(data.token);

            nameInput.value = "";
            emailInput.value = "";
            passwordInput1.value = "";
            passwordInput2.value = "";

            showJobs();
          } else {
            message.textContent = data.msg || "Registration failed.";
          }
        } catch (err) {
          console.error(err);
          message.textContent = "A communications error occurred.";
        } finally {
          enableInput(true);
        }
      } else if (e.target === registerCancel) {
        nameInput.value = "";
        emailInput.value = "";
        passwordInput1.value = "";
        passwordInput2.value = "";
        showLoginRegister();
      }
    }
  });
};

export const showRegister = () => {
  const nameInput = document.getElementById("register-name");
  const emailInput = document.getElementById("register-email");
  const passwordInput1 = document.getElementById("register-password");
  const passwordInput2 = document.getElementById("register-password2");

  if (nameInput) nameInput.value = "";
  if (emailInput) emailInput.value = "";
  if (passwordInput1) passwordInput1.value = "";
  if (passwordInput2) passwordInput2.value = "";

  if (!registerDiv) registerDiv = document.getElementById("register-div");
  setDiv(registerDiv);
};
