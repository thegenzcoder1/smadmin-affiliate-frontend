export async function http(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json();

  // ❌ Backend error → throw
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  // ✅ Success
  return data;
}
