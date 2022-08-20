class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _handleServerResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`).then(
      (dataObject) => dataObject
    );
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      credentials: 'include',
      headers: this._headers,
    }).then((res) => this._handleServerResponse(res));
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      credentials: 'include',
      headers: this._headers,
    }).then((res) => this._handleServerResponse(res));
  }

  changeAvatar(avatarUrl) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatarUrl,
      }),
    }).then((res) => this._handleServerResponse(res));
  }

  postCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: data.title,
        link: data.cardLink,
      }),
    }).then((res) => this._handleServerResponse(res));
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      credentials: 'include',
      headers: this._headers,
    }).then((res) => this._handleServerResponse(res));
  }

  setUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    }).then((res) => this._handleServerResponse(res));
  }

  changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      credentials: 'include',
      headers: this._headers,
    }).then((res) => this._handleServerResponse(res));
  }
}

const api = new Api({
  // baseUrl:'http://localhost:3000',
  baseUrl: 'api.meniaylo.nomoredomains.sbs',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
