export function setToken(token: string): void {
  localStorage.setItem('token', token);
}
export function getToken(): string | null {
  const token = localStorage.getItem('token');
  return token;
}
export function delToken(): void {
  localStorage.removeItem('token');
}

export function clear(): void {
  // localStorage.removeItem('token');

  localStorage.clear();
}
