
# ⚠️ Work in progress - will be published to NPM once ready to be used.

# cypress-random-test-order

Cypress.io plugin to allow tests to be ran in random order.

When using this plugin the `it` blocks within a test will be ran in a random order (rather than the usual top -> bottom)

Heavily based on [cypress-select-tests](https://github.com/bahmutov/cypress-select-tests) by [@bahmutov](https://github.com/bahmutov)


## Install

Assuming [Cypress](https://www.cypress.io) has been installed:

```shell
npm install --save-dev cypress-random-test-order
```

Add the following to your cypess/plugins/index.js file:
```js
const randomiseTests = require('cypress-random-test-order/randomise')
module.exports = (on, config) => {
  on('file:preprocessor', randomiseTests(config))
}
```

### Warning ⚠️

- this package assumes JavaScript specs
- this package might conflict and/or overwrite other Cypress Browserify preprocessor settings


## Usage

Run Cypress tests as normal but pass in `random=true` as an environment variable.

```shell
npx cypress run --env random=true
```

Can also be used with the Cypress test runner.

```shell
npx cypress open --env random=true
```

## Limitations

- Currently this will only work with a basic spec file, containing one `describe` block and multiple `it` blocks. It won't work with additional `describe` or `context` blocks.
   - This will work:
   ```
    describe('an example test', () => {
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
      })
    })
   ```
   - This won't work:
   ```
    describe('an example test', () => {
      context('first batch of stuff', () => {
        it('first test', () => {
          expect(true).to.equal(true)
        })
        it('second test', () => {
          expect(true).to.equal(true)
        })
      })
      context('second batch of stuff', () => {
        it('third test', () => {
          expect(true).to.equal(true)
        })
        it('fourth test', () => {
          expect(true).to.equal(true)
        })
      })
    })
   ```
- Any functions or hooks (`before`, `after`, etc) need to come before first `it` block.
- Only the `it` blocks within a spec file will be randomised, the specs themselves will still run in alphabetical order


## Small print

Author: Matt Charlton &copy; 2020

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module
[open an issue](https://https://github.com/mncharlton/cypress-random-test-order/issues/) on Github

## MIT License

Copyright (c) 2020 Matt Charlton

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
