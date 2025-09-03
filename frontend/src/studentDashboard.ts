import { logoutUser } from './api.ts';

export function setupStudentDashboard(element: HTMLElement) {
  element.innerHTML = `
    <div class="container">
      <h1>Student Dashboard</h1>
      <p>Welcome, Student!</p>
      <nav>
        <ul>
          <li><a href="#available-exams">Available Exams</a></li>
          <li><a href="#my-attempts">My Attempts</a></li>
          <li><a href="#my-classes">My Classes</a></li>
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