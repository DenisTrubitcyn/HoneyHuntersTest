const form = document.querySelector('.formvalidation')
const validatebtn = form.querySelector('.validatebtn')
const fields = form.querySelectorAll('.field')
const username = form.querySelector('.username')
const email = form.querySelector('.email')
const comment = form.querySelector('.comment')
const cards = document.querySelector('.cards')
const requestURL = 'https://613b4251110e000017a4553b.mockapi.io/api/v1/cards'

const handleChange = () => {
  for (const field of fields) {
    if (field.value === '') {
      validatebtn.setAttribute('disabled', '')
      return
    }
  }
  validatebtn.removeAttribute('disabled')
}
for (const field of fields) {
  field.onkeydown = field.onkeyup = field.onkeypress = field.change = handleChange
}

// ============================================================================================
if (addEventListener in document) {
  resize()
  document.addEventListener(
    'load',
    receiveRequest('GET', requestURL)
      .then((data) => addCardsToHtmlForDb(data))
      .catch((err) => console.log(err)),
    false
  )
} else {
  resize()
  document.onload = receiveRequest('GET', requestURL)
    .then((data) => addCardsToHtmlForDb(data))
    .catch((err) => console.log(err))
}

function receiveRequest(method, url) {
  return fetch(url).then((response) => {
    return response.json()
  })
}
// ===========================================================
const addCardsToHtmlForDb = (data) => {
  const arrayCards = data
  for (i = 0; i < arrayCards.length; i++) {
    let arr = arrayCards[i]
    for (let key in arr) {
      if (key == 'card') {
        const card = arr[key]
        appendHtml(card)
      }
    }
  }
}

function resize() {
  if (window.innerWidth < 768) {
    cards.classList.add('flex-column-reverse')
  } else {
    cards.classList.remove('flex-column-reverse')
  }
}
// ===============================================================================================

function sendRequest(method, url, body = null) {
  const headers = {
    'Content-Type': 'application/json',
  }
  return fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: headers,
  }).then((response) => {
    if (response.ok) {
      return response.json()
    }
    return response.json().then((error) => {
      const e = new Error('Что-то пошло не так')
      e.data = error
      throw e
    })
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
    const card = `
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
    const body = {
      card: card,
    }
    sendRequest('POST', requestURL, body)
      .then((data) => console.log(data))
      .catch((err) => console.log(err))

    clearValue()

    appendHtml(card)
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

String.prototype.firstLetterCaps = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

const appendHtml = function (card) {
  cards.innerHTML += card
}

const clearValue = function () {
  username.value = ''
  email.value = ''
  comment.value = ''
  array.length = 0
  validatebtn.setAttribute('disabled', 'disabled')
}

validatebtn.addEventListener('click', validationEmail)
