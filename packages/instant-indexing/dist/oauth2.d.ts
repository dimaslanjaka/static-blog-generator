import { Auth } from 'googleapis';
export type MergedAuthClient = Auth.AuthClient & Auth.OAuth2Client;
export interface CustomAuthClient extends MergedAuthClient {
    [key: string]: any;
    credentials: Auth.Credentials & {
        [key: string]: any;
    };
}
export declare const scopes: string[];
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return
 */
export declare function loadSavedCredentialsIfExist(): import("google-auth-library/build/src/auth/googleauth").JSONClient;
/**
 * refresh access token
 * @returns
 */
export declare function refreshToken(): Promise<void>;
/**
 * Check offline token is expired
 * @returns
 */
export declare function checkTokenExpired(): Promise<boolean>;
/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 * @returns
 */
export declare function googleAuthenticate(scopes: string[], rewrite?: boolean): Promise<MergedAuthClient>;
/**
 * Authorize with IAM Admin Email
 * @param scopes
 * @returns
 */
export declare function jwtAuthenticate(scopes?: string[]): Promise<MergedAuthClient>;
export declare function getPeopleInfo(): Promise<import("googleapis").people_v1.Schema$Person>;
