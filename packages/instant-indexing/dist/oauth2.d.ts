/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 * @returns {Promise<import('googleapis').Auth.OAuth2Client>}
 */
export function authenticate(scopes: any, rewrite?: boolean): Promise<import('googleapis').Auth.OAuth2Client>;
/**
 * Authorize with IAM Admin Email
 * @returns {Promise<import('googleapis').Auth.Compute>}
 */
declare function jwtAuthenticate(): Promise<import('googleapis').Auth.Compute>;
export const scopes: string[];
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {import('googleapis').Auth.OAuth2Client | { credentials: Record<string,any> }} client
 * @return {void}
 */
export function saveCredentials(client: import('googleapis').Auth.OAuth2Client | {
    credentials: Record<string, any>;
}): void;
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {import('googleapis').Auth.OAuth2Client | null}
 */
export function loadSavedCredentialsIfExist(): import('googleapis').Auth.OAuth2Client | null;
/**
 * Check offline token is expired
 * @returns {Promise<boolean>}
 */
export function checkTokenExpired(): Promise<boolean>;
/**
 * refresh access token
 * @returns {Promise<void>}
 */
export function refreshToken(): Promise<void>;
export { jwtAuthenticate as jwtAuthorize };
