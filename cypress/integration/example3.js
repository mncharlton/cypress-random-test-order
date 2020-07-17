describe('an example test', () => {
  beforeEach(() => {
    cy.log('Before each outside the context')
  })

  context('first stuff', () => {
    beforeEach(() => {
      cy.log('Before each in the context')
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
    })
  })
  context('second stuff', () => {
    before(() => {
      cy.log('Before in the context')
    })
    it('fifth test', () => {
      expect(true).to.equal(true)
    })
    it('sixth test', () => {
      expect(true).to.equal(true)
    })
    it('seventh test', () => {
      expect(true).to.equal(true)
    })
    it('eighth test', () => {
      expect(true).to.equal(true)
      cy.visit('https://www.google.co.uk')
    })
  })
})
