export const login = (username, password) => {
  // MOCK USERS (for now)
  if (username === "admin" && password === "admin123") {
    localStorage.setItem(
      "user",
      JSON.stringify({ username, role: "ADMIN" })
    );
    return true;
  }

  if (username === "operator" && password === "operator123") {
    localStorage.setItem(
      "user",
      JSON.stringify({ username, role: "OPERATOR" })
    );
    return true;
  }

  return false;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};
