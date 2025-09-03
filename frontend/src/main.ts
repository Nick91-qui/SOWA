import './style.css'
import { setupLogin } from './login.ts';
import { setupRegister } from './register.ts';
import { setupProfessorDashboard } from './professorDashboard.ts';
import { setupStudentDashboard } from './studentDashboard.ts';
import { setupCreateExam } from './createExam.ts';
import { setupTakeExam } from './takeExam.ts';
import { setupViewAttempt } from './viewAttempt.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="app-content"></div>
`;

const appContent = document.querySelector<HTMLDivElement>('#app-content')!;

const routes: { [key: string]: (element: HTMLElement) => void } = {
  '': setupLogin, // Default route
  '#login': setupLogin,
  '#register': setupRegister,
  '#dashboard': (element: HTMLElement) => {
    const userType = localStorage.getItem('user_type'); // Assuming user_type is stored in localStorage after login
    if (userType === 'professor') {
      setupProfessorDashboard(element);
    } else if (userType === 'aluno') {
      setupStudentDashboard(element);
    } else {
      // Redirect to login if no user type is found or invalid
      window.location.hash = '#login';
    }
  },
  '#create-exam': setupCreateExam,
  '#take-exam': setupTakeExam,
  '#view-attempt': setupViewAttempt,
  // Add other routes here as you create more components
};

function router() {
  const hash = window.location.hash;
  const setupFunction = routes[hash] || routes[''];
  setupFunction(appContent);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

router();
