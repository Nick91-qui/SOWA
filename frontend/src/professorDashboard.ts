import { logoutUser } from './api.ts';

export function setupProfessorDashboard(element: HTMLElement) {
  element.innerHTML = `
    <div class="container">
      <h1>Professor Dashboard</h1>
      <p>Welcome, Professor!</p>
      <nav>
        <ul>
          <li><a href="#create-exam">Create New Exam</a></li>
          <li><a href="#my-exams">View My Exams</a></li>
          <li><a href="#my-classes">View My Classes</a></li>
          <li><a href="#" id="logout-button">Logout</a></li>
        </ul>
      </nav>
    </div>
  `;

  element.querySelector('#logout-button')?.addEventListener('click', (event) => {
    event.preventDefault();
    logoutUser();
  });
}