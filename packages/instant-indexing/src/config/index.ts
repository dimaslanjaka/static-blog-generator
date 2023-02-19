import { readdirSync } from 'fs-extra';
import { writefile } from 'sbg-utility';
import { join } from 'upath';
import { ClientSecretType, ServiceAccountType } from './globals';

let clientSecret: ClientSecretType;
let clientSecretPath: string;

/**
 * set client secret
 * @param o
 */
export function setClientSecret(o: ClientSecretType | string) {
  if (typeof o === 'string') {
    clientSecretPath = o;
    clientSecret = JSON.parse(readdirSync(o).toString());
  } else {
    clientSecret = o;
  }
}

/**
 * get client secret
 * @returns
 */
export function getClientSecret() {
  return {
    path: clientSecretPath,
    key: clientSecret
  };
}

let ServiceAccount: ServiceAccountType;
let ServiceAccountPath: string;

/**
 * Get Service Account
 * @returns
 */
export async function getServiceAccount() {
  return {
    /**
     * Service Account JSON Parsed
     */
    key: ServiceAccount,
    /**
     * Service Account JSON File Location
     */
    path: ServiceAccountPath
  };
}

/**
 * Set Service Account
 * @param o
 */
export function setServiceAccount(o: ServiceAccountType | string) {
  if (typeof o === 'string') {
    ServiceAccountPath = o;
    ServiceAccount = JSON.parse(readdirSync(o).toString());
  } else {
    ServiceAccount = o;
  }
}

// write service account from Base64 format env variable
if (typeof process.env.GSERVICEPEM === 'string') {
  const key = Buffer.from(process.env.GSERVICEPEM, 'base64').toString('ascii');
  const saveto = join(__dirname, 'service-account.json');
  writefile(saveto, key);
  setServiceAccount(saveto);
}

// write client secret from Base64 format env variable
if (typeof process.env.GCLIENTPEM === 'string') {
  const saveto = join(__dirname, 'client-secret.json');
  const key = Buffer.from(process.env.GCLIENTPEM, 'base64').toString('ascii');
  writefile(saveto, key);
  setClientSecret(saveto);
}

// module.exports = serviceConfig;
