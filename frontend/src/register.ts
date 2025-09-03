import { registerUser } from './api';

export function setupRegister(element: HTMLElement) {
  element.innerHTML = `
    <div class="container">
      <h1>Register</h1>
      <form id="register-form">
        <input type="text" id="register-name" placeholder="Name" required />
        <input type="email" id="register-email" placeholder="Email" required />
        <input type="password" id="register-password" placeholder="Password" required />
        <select id="register-type" required>
          <option value="aluno">Student</option>
          <option value="professor">Professor</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="#login">Login here</a></p>
      <p id="register-message" class="message"></p>
    </div>
  `;

  const registerForm = element.querySelector<HTMLFormElement>('#register-form');
  const registerMessage = element.querySelector<HTMLParagraphElement>('#register-message');

  registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = (element.querySelector<HTMLInputElement>('#register-name') as HTMLInputElement).value;
    const email = (element.querySelector<HTMLInputElement>('#register-email') as HTMLInputElement).value;
    const password = (element.querySelector<HTMLInputElement>('#register-password') as HTMLInputElement).value;
    const type = (element.querySelector<HTMLSelectElement>('#register-type') as HTMLSelectElement).value;

    try {
      const user = await registerUser(name, email, password, type);
      if (user) {
        if (registerMessage) registerMessage.textContent = 'Registration successful! You can now log in.';
        // Optionally redirect to login page
        window.location.hash = '#login';
      } else {
        if (registerMessage) registerMessage.textContent = 'Registration failed.';
      }
    } catch (error: any) {
      if (registerMessage) registerMessage.textContent = `Error: ${error.response?.data?.detail || error.message}`;
    }
  });
}