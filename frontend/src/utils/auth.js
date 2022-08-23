// export const BASE_URL = 'https://api.meniaylo.nomoredomains.sbs';
export const BASE_URL = 'http://localhost:3000';


export const register = ({ password, email }) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  })
  .then(handleServerResponse)
}

export const login = ({ password, email }) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  })
  .then(handleServerResponse)
}

// export const checkIfIsLogged = () => {
//   return fetch(`${BASE_URL}/users/me`, {
//     method: 'GET',
//     credentials: 'include',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//   })
//   .then(res => {
//     if (res.status === 200) {
//         return res.json();
//     }
//   })
// }

const handleServerResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`).then(
    dataObject => dataObject
  )
}