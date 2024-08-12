// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../support/index.d.ts" />

// These tests run through the chat flow.
describe('Settings', () => {
	// Check if the SKIP_OLLAMA_TESTS environment variable is set to 'true'
	before(() => {
		if (Cypress.env('SKIP_OLLAMA_TESTS') === 'true') {
			cy.log('Skipping all tests in the Settings suite');
			this.skip();
		}
	});

	// Wait for 2 seconds after all tests to fix an issue with Cypress's video recording missing the last few frames
	after(() => {
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(2000);
	});

	beforeEach(() => {
		// Login as the admin user
		cy.loginAdmin();
		// Visit the home page
		cy.visit('/');
	});

	context('Ollama', () => {
		it('user can select a model', () => {
			// Click on the model selector
			cy.get('button[aria-label="Select a model"]').click();
			// Select the first model
			cy.get('button[aria-label="model-item"]').first().click();
		});

		it('user can perform text chat', () => {
			// Click on the model selector
			cy.get('button[aria-label="Select a model"]').click();
			// Select the first model
			cy.get('button[aria-label="model-item"]').first().click();
			// Type a message
			cy.get('#chat-textarea').type('Hi, what can you do? A single sentence only please.', {
				force: true
			});
			// Send the message
			cy.get('button[type="submit"]').click();
			// User's message should be visible
			cy.get('.chat-user').should('exist');
			// Wait for the response
			cy.get('.chat-assistant', { timeout: 120_000 }) // .chat-assistant is created after the first token is received
				.find('div[aria-label="Generation Info"]', { timeout: 120_000 }) // Generation Info is created after the stop token is received
				.should('exist');
		});

		it('user can share chat', () => {
			// Click on the model selector
			cy.get('button[aria-label="Select a model"]').click();
			// Select the first model
			cy.get('button[aria-label="model-item"]').first().click();
			// Type a message
			cy.get('#chat-textarea').type('Hi, what can you do? A single sentence only please.', {
				force: true
			});
			// Send the message
			cy.get('button[type="submit"]').click();
			// User's message should be visible
			cy.get('.chat-user').should('exist');
			// Wait for the response
			cy.get('.chat-assistant', { timeout: 120_000 }) // .chat-assistant is created after the first token is received
				.find('div[aria-label="Generation Info"]', { timeout: 120_000 }) // Generation Info is created after the stop token is received
				.should('exist');
			// spy on requests
			const spy = cy.spy();
			cy.intercept('GET', '/api/v1/chats/*', spy);
			// Open context menu
			cy.get('#chat-context-menu-button').click();
			// Click share button
			cy.get('#chat-share-button').click();
			// Check if the share dialog is visible
			cy.get('#copy-and-share-chat-button').should('exist');
			cy.wrap({}, { timeout: 5000 }).should(() => {
				// Check if the request was made twice (once for to replace chat object and once more due to change event)
				expect(spy).to.be.callCount(2);
			});
		});

		it('user can generate image', () => {
			// Click on the model selector
			cy.get('button[aria-label="Select a model"]').click();
			// Select the first model
			cy.get('button[aria-label="model-item"]').first().click();
			// Type a message
			cy.get('#chat-textarea').type('Hi, what can you do? A single sentence only please.', {
				force: true
			});
			// Send the message
			cy.get('button[type="submit"]').click();
			// User's message should be visible
			cy.get('.chat-user').should('exist');
			// Wait for the response
			cy.get('.chat-assistant', { timeout: 120_000 }) // .chat-assistant is created after the first token is received
				.find('div[aria-label="Generation Info"]', { timeout: 120_000 }) // Generation Info is created after the stop token is received
				.should('exist');
			// Click on the generate image button
			cy.get('[aria-label="Generate Image"]').click();
			// Wait for image to be visible
			cy.get('img[data-cy="image"]', { timeout: 60_000 }).should('be.visible');
		});
	});
});
