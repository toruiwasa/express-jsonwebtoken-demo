export const fetchMe = async () => {
  const res = await fetch("https://localhost:4000/me", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return null;

  return await res.json();
};

export const refreshToken = async () => {
  return await fetch("https://localhost:4000/refresh_token", {
    method: "POST",
    credentials: "include",
  });
};
