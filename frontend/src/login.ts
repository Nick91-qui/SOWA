import { loginUser, getCurrentUserType } from './api.ts';

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
        console.log('Full token object:', token);
        localStorage.setItem('access_token', token.access_token);
        localStorage.setItem('token_type', token.token_type);
        
        // Get user_type from backend if not in token
        const userType = token.user_type || await getCurrentUserType();
        console.log('User type determined:', userType);
        if (userType) {
          localStorage.setItem('user_type', userType);
        }
        if (loginMessage) loginMessage.textContent = 'Login successful!';
        // Redirect to dashboard or home page
        window.location.hash = '#dashboard';
        console.log('Redirecting to #dashboard');
      } else {
        if (loginMessage) loginMessage.textContent = 'Login failed. Please check your credentials.';
      }
    } catch (error: any) {
      if (loginMessage) loginMessage.textContent = error.response?.data?.detail === 'Incorrect username or password' 
        ? 'Usuário ou senha incorretos' 
        : `Error: ${error.response?.data?.detail || error.message}`;
    }
  });
}