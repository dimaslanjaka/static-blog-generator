import { ServiceAccountType } from './globals';
export declare function getApiConfig(index?: number): any;
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
