describe('Uppgift2', function () {
    it('Log in failed', function () {
        cy.visit('http://localhost:8000')
        cy.get('input[type="username"]')
            .type('write admin{enter}')
            .type('write password{enter}')
    })
})