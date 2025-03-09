import { getCookie } from "./utils";

const BASE_URL = "https://memoize-server.vercel.app/api";

// @url /user/register
// @method POST
// @param {string} username, {string} email, {string} password
// @returns {Promise}
// @protected false
// @description Register a new user
export const registerUser = async ({ username, email, password }) => {
  const response = await fetch(`${BASE_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  return await response.json();
};

// @url /user/login
// @method POST
// @param {string} identifier, {string} password
// @returns {Promise}
// @protected false
// @description Login a user
export const loginUser = async ({ identifier, password }) => {
  const response = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, password }),
  });
  return await response.json();
};

// @url /user/fetch-user
// @method GET
// @returns {Promise}
// @protected true
// @description Fetch a user
export const fetchUser = async () => {
  const response = await fetch(`${BASE_URL}/user/fetch-user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  return await response.json();
};

export const updateAvatar = async ({avatar}) => {
  const response = await fetch(`${BASE_URL}/user/update-avatar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify({ avatar }),
  });
  return await response.json();
}

// @url /user/check-username-availability
// @method POST
// @param {string} username
// @returns {Promise}
// @protected false
// @description Check if username is available
export const checkUsernameAvailability = async (username) => {
  const response = await fetch(`${BASE_URL}/user/check-username-availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  return await response.json();
};

// @url /user/check-email-availability
// @method POST
// @param {string} email
// @returns {Promise}
// @protected false
// @description Check if email is available
export const checkEmailAvailability = async (email) => {
  const response = await fetch(`${BASE_URL}/user/check-email-availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return await response.json();
};

// @url /note/create
// @method POST
// @param {string} title, {string} content, {string} color, {boolean} pinned
// @returns {Promise}
// @protected true
// @description Create a new note
export const createNote = async ({
  id,
  title,
  content,
  color,
  status,
  pinned,
}) => {
  const response = await fetch(`${BASE_URL}/note/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify({ id, title, content, color, status, pinned }),
  });
  return await response.json();
};

// @url /note/update
// @method PUT
// @param {string} id, {string} title, {string} content, {string} color, {boolean} pinned, {string} status
// @returns {Promise}
// @protected true
// @description Update a note
export const updateNote = async ({
  id,
  title,
  content,
  color,
  pinned,
  status,
}) => {
  const response = await fetch(`${BASE_URL}/note/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify({ id, title, content, color, pinned, status }),
  });
  return await response.json();
};

// @url /note/delete
// @method DELETE
// @param {string} id
// @returns {Promise}
// @protected true
// @description Delete a note
export const deleteNote = async ({ id }) => {
  const response = await fetch(`${BASE_URL}/note/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify({ id }),
  });
  return await response.json();
};
