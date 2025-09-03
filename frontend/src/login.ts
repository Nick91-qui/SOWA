import { loginUser } from './api';

export function setupLogin(element: HTMLElement) {
  element.innerHTML = `
    <div class="container">
      <h1>Login</h1>
      <form id="login-form">
        <input type="email" id="login-email" placeholder="Email" required />
        <input type="password" id="login-password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="#register">Register here</a></p>
      <p id="login-message" class="message"></p>
    </div>
  `;

  const loginForm = element.querySelector<HTMLFormElement>('#login-form');
  const loginMessage = element.querySelector<HTMLParagraphElement>('#login-message');

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = (element.querySelector<HTMLInputElement>('#login-email') as HTMLInputElement).value;
    const password = (element.querySelector<HTMLInputElement>('#login-password') as HTMLInputElement).value;

    try {
      const token = await loginUser(email, password);
      if (token) {
        localStorage.setItem('access_token', token.access_token);
        localStorage.setItem('token_type', token.token_type);
        localStorage.setItem('user_type', token.user_type); // Store user type
        if (loginMessage) loginMessage.textContent = 'Login successful!';
        // Redirect to dashboard or home page
        window.location.hash = '#dashboard';
      } else {
        if (loginMessage) loginMessage.textContent = 'Login failed. Please check your credentials.';
      }
    } catch (error: any) {
      if (loginMessage) loginMessage.textContent = `Error: ${error.response?.data?.detail || error.message}`;
    }
  });
}