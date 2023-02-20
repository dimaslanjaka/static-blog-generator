import { ClientSecretType, ServiceAccountType } from './globals';
export * from './globals';
/**
 * set client secret
 * @param o
 */
export declare function setClientSecret(o: ClientSecretType | string): void;
/**
 * get client secret
 * @returns
 */
export declare function getClientSecret(): {
    path: string;
    key: ClientSecretType;
};
/**
 * Get Service Account
 * @returns
 */
export declare function getServiceAccount(): Promise<{
    /**
     * Service Account JSON Parsed
     */
    key: ServiceAccountType;
    /**
     * Service Account JSON File Location
     */
    path: string;
}>;
/**
 * Set Service Account
 * @param o
 */
export declare function setServiceAccount(o: ServiceAccountType | string): void;
