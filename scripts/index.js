const form = document.querySelector('.formvalidation')
const validatebtn = form.querySelector('.validatebtn')
const fields = form.querySelectorAll('.field')
const username = form.querySelector('.username')
const email = form.querySelector('.email')
const comment = form.querySelector('.comment')

const requestURL = 'https://613b4251110e000017a4553b.mockapi.io/api/v1/cards'

function sendRequest(method, url, body = null) {
  const headers = {
    'content-Type': 'application/json',
  }
  return fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: headers,
  }).then((responce) => {
    return responce.json()
  })
}

const array = []

const validationEmail = () => {
  removeValidation()
  const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  if (reg.test(email.value) == false) {
    const error = generateError('Введите корректный E-mail')
    email.parentElement.insertBefore(error, email)
    return false
  } else {
    const body = {
      name: username.value,
      email: email.value,
      text: comment.value,
    }
    sendRequest('POST', requestURL, body)
      .then((data) => console.log(data))
      .catch((err) => console.log(err))

    appendHtml()
  }
}

const generateError = function (text) {
  const error = document.createElement('div')
  error.className = 'error'
  error.style.color = 'red'
  error.innerHTML = text
  return error
}

const removeValidation = function () {
  const errors = form.querySelectorAll('.error')
  for (let i = 0; i < errors.length; i++) {
    errors[i].remove()
  }
}

const validationValue = function (el) {
  array.push(el)
  if (array.length === fields.length) {
    validatebtn.removeAttribute('disabled')
  }
}

String.prototype.firstLetterCaps = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

const appendHtml = function () {
  const cards = document.querySelector('#cards')
  cards.innerHTML += `
    <div class="text-center col-md-4 mb-3">
      <p class="card__title h3 pt-2 pb-2">${username.value.firstLetterCaps()}</p>
      <div class="card__main">
        <p class="card__email fw-bold p-3">${email.value}</p>
        <div class="card__text">
          <p class="card__text p-4">${comment.value.firstLetterCaps()}</p>
        </div>
      </div>
    </div>
  `

  clearValue()
}

const clearValue = function () {
  username.value = ''
  email.value = ''
  comment.value = ''
  array.length = 0
  validatebtn.setAttribute('disabled', 'disabled')
}

validatebtn.addEventListener('click', validationEmail)
