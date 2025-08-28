describe('Register Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
  });

  it('should display validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('O e-mail é obrigatório.').should('be.visible');
    cy.contains('A senha é obrigatória.').should('be.visible');
    cy.contains('A confirmação da senha é obrigatória.').should('be.visible');
  });

  it('should display validation error for invalid email format', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Por favor, insira um e-mail válido.').should('be.visible');
  });

  it('should display validation error for short password', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('short');
    cy.get('input[name="confirmPassword"]').type('short');
    cy.get('button[type="submit"]').click();
    cy.contains('A senha deve ter pelo menos 6 caracteres.').should('be.visible');
  });

  it('should display validation error for non-matching passwords', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('passwordABC');
    cy.get('button[type="submit"]').click();
    cy.contains('As senhas não coincidem.').should('be.visible');
  });

  it('should display error for already registered email', () => {
    cy.intercept('POST', `${Cypress.env('NEXT_PUBLIC_API_URL')}/api/v1/users/open`, {
      statusCode: 409,
      body: { detail: 'E-mail já registrado.' },
    }).as('registerRequest');

    cy.get('input[name="email"]').type('existing@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest');
    cy.contains('E-mail já registrado.').should('be.visible');
  });

  it('should successfully register with valid credentials', () => {
    cy.intercept('POST', `${Cypress.env('NEXT_PUBLIC_API_URL')}/api/v1/users/open`, {
      statusCode: 200,
      body: { message: 'User registered successfully' },
    }).as('registerRequest');

    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest');
    cy.url().should('include', '/login'); // Assuming successful registration redirects to login
  });
});