import type { TokenClaims, UserData, UserRole } from "./types";

/**
 * Encrypts the given object to a JWT token
 * @ref https://stackoverflow.com/questions/20977968/javascript-jwt-with-public-and-private-key
 */
export function decryptJwt(token: string): TokenClaims {
    // Retrieve claims part of the token
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(window.atob(base64).split("").map(c => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));

    return JSON.parse(jsonPayload);
}

/**
 * Checks if user is allowed according to his role and a give set of requirements
 * @param user A user
 * @param roles Array of user roles that them and only them are allowed to perform a certain action
 * @returns `true` if user is allowed, `false` otherwise
 */
export function userIsAllowed(user: UserData | undefined | null, roles: UserRole[]) {
    // Role requirements are empty; All users/guests permitted
    if(roles.length === 0) { return true; }

    if (!user) { return false; }

    return roles.some(role => role === user.userRole);
}