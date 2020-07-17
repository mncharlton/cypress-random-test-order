describe('an example test', () => {
  before(() => {
    expect(true).to.equal(true)
    cy.log('Before!')
  })
  beforeEach(() => {
    expect(true).to.equal(true)
    cy.log('Before Each!')
  })
  it('first test', () => {
    expect(true).to.equal(true)
  })
  it('second test', () => {
    expect(true).to.equal(true)
  })
  it('third test', () => {
    expect(true).to.equal(true)
  })
  it('fourth test', () => {
    expect(true).to.equal(true)
    cy.visit('https://www.google.co.uk')
    // cy.get('[title="Search"]').type('Bananas')
    // cy.contains('Google Search').click()
    // cy.contains('About 660,000,000 results').should('be.visible')
  })

  after(() => {
    expect(true).to.equal(true)
    cy.log('after!')
  })
})
