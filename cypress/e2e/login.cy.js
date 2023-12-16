import { faker } from '@faker-js/faker';
import { registerUser } from '../../users';

describe('template spec', () => {
  beforeEach(() => {
    global.user = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password()
    }
    cy.request('POST', 'http://localhost:8000/clear')
    cy.visit('http://localhost:8000/register')
    for (let k of ['email', 'username', 'password']) {
      cy.get('input[name="' + k + '"]')
        .type(global.user[k])
    } 
    cy.get('input[name="repeatPassword"')  
      .type(global.user.password)

    cy.get('button[type="submit"]')
      .click()
    cy.location('pathname').should('include', '/register')
  })
  it('Fails to create account due to mismatching passwords', () => {
    user = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password()
    } 
    cy.visit('http://localhost:8000/register')
    for (let k of ['email', 'username', 'password']) {
      cy.get('input[name="' + k + '"]')
        .type(global.user[k])
    } 
    cy.get('input[name="repeatPassword"')  
      .type(global.user.password)

    cy.get('button[type="submit"]')
      .click()
    cy.location('pathname').should('include', '/register')

  })
  it('visit', () => {
    cy.visit('http://localhost:8000/login')
  })
  it('login_sucessfully', () => {
    cy.visit('http://localhost:8000/login')
    for (let k of ['username', 'password']) {
      cy.get('input[name="' + k + '"]')
        .type(global.user[k])
    }
    cy.get("button[type='submit']")
      .click()
    cy.url().should('contains', '/dashboard')
  })
  it('change_password_success', () => {
    cy.visit('http://localhost:8000/login')
    for (let k of ['username', 'password']) {
      cy.get('input[name="' + k + '"]')
        .type(global.user[k])
    }

    cy.get("button[type='submit']")
      .click()
    cy.visit('http://localhost:8000/dashboard/change-password')

    cy.get('input[name="password"]')
      .type(global.user.password)

    const newPassword = faker.internet.password()
    cy.get('input[name="newPassword"]')
      .type(newPassword)
      cy.get('input[name="repeatNewPassword"]')
        .type(newPassword)

    cy.get("button[type='submit']")
      .click()
 
    cy.url().should('contains', '/dashboard')
    cy.get("body").should('contain', 'Password changed successfully') 
  })
  it('failed to change password due to wrong old password', () => {
    cy.visit('http://localhost:8000/login')
    for (let k of ['username', 'password']) {
      cy.get('input[name="' + k + '"]')
        .type(global.user[k])
    }
    cy.get("button[type='submit']")
      .click()
    cy.visit('http://localhost:8000/dashboard/change-password')

    cy.get('input[name="password"]')
      .type(faker.internet.password())

    const newPassword = faker.internet.password()
    cy.get('input[name="newPassword"]')
      .type(newPassword)
      cy.get('input[name="repeatNewPassword"]')
        .type(newPassword)

    cy.get("button[type='submit']")
      .click()
 
    cy.get("body").should('contain', 'Error: Invalid password')
  })
  it('failed to change password due to mismatching passwords', () => {
    cy.visit('http://localhost:8000/login')
    for (let k of ['username', 'password']) {
      cy.get('input[name="' + k + '"]')
        .type(global.user[k])
    }
    cy.get("button[type='submit']")
      .click()
    cy.visit('http://localhost:8000/dashboard/change-password')

    cy.get('input[name="password"]')
      .type(faker.internet.password())

    const newPassword = faker.internet.password()
    cy.get('input[name="newPassword"]')
      .type(newPassword)
    cy.get('input[name="repeatNewPassword"]')
      .type(faker.internet.password())

    cy.get("button[type='submit']")
      .click()
 
    cy.get("body").should('contain', 'Error: Passwords does not match')
  })
})