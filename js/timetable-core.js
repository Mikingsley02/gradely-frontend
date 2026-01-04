export async function getAdmin() {
  const res = await fetch(`${BACKEND_URL}/api/admin/me`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("SESSION_EXPIRED");
  return res.json();
}
