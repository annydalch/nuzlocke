let form = document.getElementById('signup-form')
let username = document.getElementById('username')
let password = document.getElementById('password')
let verifyPassword = document.getElementById('verify-password')
let passwordErrorMessage = document.getElementById('password-error-message')
let usernameErrorMessage = document.getElementById('username-error-message')

form.addEventListener('submit', event => {
  if (password.value !== verifyPassword.value) {
    passwordErrorMessage.display = 'initial'
    event.preventDefault()
  } else {
    passwordErrorMessage.display = 'none'
  }
  if (!username.value) {
    usernameErrorMessage.display = 'initial'
    event.preventDefault()
  } else {
    usernameErrorMessage.display = 'none'
  }
}, false)
