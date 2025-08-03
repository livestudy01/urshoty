
import { Client, Account, Databases, Query } from 'appwrite';

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!APPWRITE_PROJECT_ID || APPWRITE_PROJECT_ID === 'YOUR_PROJECT_ID') {
    console.warn('VITE_APPWRITE_PROJECT_ID is not set. Please update your environment configuration.');
}

const client = new Client();

client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const database = new Databases(client);

export { Query };
