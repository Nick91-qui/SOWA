describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('should display validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('O e-mail é obrigatório.').should('be.visible');
    cy.contains('A senha é obrigatória.').should('be.visible');
  });

  it('should display validation error for invalid email format', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Por favor, insira um e-mail válido.').should('be.visible');
  });

  it('should display validation error for short password', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('short');
    cy.get('button[type="submit"]').click();
    cy.contains('A senha deve ter pelo menos 6 caracteres.').should('be.visible');
  });

  it('should display error for invalid credentials', () => {
    cy.intercept('POST', `${Cypress.env('NEXT_PUBLIC_API_URL')}/api/v1/login/access-token`, {
      statusCode: 400,
      body: { detail: 'Credenciais inválidas.' },
    }).as('loginRequest');

    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.contains('Credenciais inválidas.').should('be.visible');
  });

  it('should successfully log in with valid credentials', () => {
    cy.intercept('POST', `${Cypress.env('NEXT_PUBLIC_API_URL')}/api/v1/login/access-token`, {
      statusCode: 200,
      body: { access_token: 'mock_token', token_type: 'bearer' },
    }).as('loginRequest');

    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/dashboard'); // Assuming successful login redirects to dashboard
  });
});