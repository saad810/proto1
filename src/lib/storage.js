const storagePrefix = "Check2Learn_";

const storage = {
  getToken: () => JSON.parse(window.localStorage.getItem(`${storagePrefix}token`)),
  setToken: (token) => window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token)),
  clearToken: () => window.localStorage.removeItem(`${storagePrefix}token`),

  // Extended session functions
  getSession: (key) => JSON.parse(window.localStorage.getItem(`${storagePrefix}${key}`)),
  setSession: (key, value) =>
    window.localStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(value)),
  clearSession: (key) => window.localStorage.removeItem(`${storagePrefix}${key}`),
};

export default storage;
