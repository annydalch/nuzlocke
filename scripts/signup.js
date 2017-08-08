'use strict'

/* global XMLHttpRequest */
/* global close */

let badChars = new RegExp(/[/\\^\-[\]|&;$%@'"<>()+,]/g)
let nullChar = new RegExp(/\x00/) // eslint-disable-line no-control-regex

let submitHandler = event => { // eslint-disable-line no-unused-vars
  let form = document.getElementById('signup-form')
  let username = document.getElementById('username')
  let password = document.getElementById('password')
  let verifyPassword = document.getElementById('verify-password')

  let passwordErrorMatch = document.getElementById('password-error-match')
  let passwordErrorNone = document.getElementById('password-error-none')
  let passwordErrorBadChars = document.getElementById('password-error-bad-chars')

  let usernameErrorNone = document.getElementById('username-error-none')
  let usernameErrorAlreadyExists = document.getElementById('username-error-already-exists')
  let usernameErrorBadChars = document.getElementById('username-error-bad-chars')

  let errorNullCharacter = document.getElementById('error-null-char')

  let submit = true

  if ((nullChar.test(username.value)) || (nullChar.test(password.value))) {
    close()
    errorNullCharacter.style.display = 'block'
    errorNullCharacter.style.visibility = 'visible'
    return
  }

  if (password.value !== verifyPassword.value) {
    passwordErrorMatch.style.display = 'block'
    passwordErrorMatch.style.visibility = 'visible'
    submit = false
  } else {
    passwordErrorMatch.style.display = 'none'
    passwordErrorMatch.style.visibility = 'hidden'
  }

  if (!password.value) {
    passwordErrorNone.style.display = 'block'
    passwordErrorNone.style.visibility = 'visible'
    submit = false
  } else {
    passwordErrorNone.style.display = 'none'
    passwordErrorNone.style.visibility = 'hidden'
  }

  if (badChars.test(password.value)) {
    passwordErrorBadChars.style.display = 'block'
    passwordErrorBadChars.style.visibility = 'visible'
    submit = false
  } else {
    passwordErrorBadChars.style.display = 'none'
    passwordErrorBadChars.style.visibility = 'visible'
  }

  let usernameOk = true
  if (!username.value) {
    usernameErrorNone.style.display = 'block'
    usernameErrorNone.style.visibility = 'visible'
    submit = false
    usernameOk = false
  } else {
    usernameErrorNone.style.display = 'none'
    usernameErrorNone.style.visibility = 'hidden'
  }

  if (badChars.test(username.value)) {
    usernameErrorBadChars.style.display = 'block'
    usernameErrorBadChars.style.visibility = 'visible'
    submit = false
    usernameOk = false
  } else {
    usernameErrorBadChars.style.display = 'none'
    usernameErrorBadChars.style.visibility = 'hidden'
  }
  if (usernameOk) {
    let ajaxRequest = new XMLHttpRequest()
    ajaxRequest.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status !== 200) {
          usernameErrorAlreadyExists.style.display = 'none'
          usernameErrorAlreadyExists.style.visibility = 'hidden'
        } else {
          usernameErrorAlreadyExists.style.display = 'block'
          usernameErrorAlreadyExists.style.visibility = 'visible'
          submit = false
        }
        if (submit) {
          form.submit()
        }
      }
    }
    ajaxRequest.open('GET', '/user-exists-p/' + username.value)
    ajaxRequest.send()
  }
}
