// Modules
import { jwtDecode } from "jwt-decode";

export function getUserFromToken(token: string) {
  try {
    const decoded: any = jwtDecode(token);
    return { username: decoded.username };
  } catch (err) {
    return null;
  }
}
