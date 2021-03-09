const { palindromo } = require('../utils/for_testing')

test.skip('palindrome od midudev', () => {
  const result = palindromo('midudev')

  expect(result).toBe('vedudim')
})

test.skip('palindrome of empty string', () => {
  const result = palindromo('')

  expect(result).toBe('')
})
test.skip('palindrome of undefined', () => {
  const result = palindromo()

  expect(result).toBeUndefined()
})