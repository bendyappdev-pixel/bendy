// TODO: Re-enable App Check token attachment once App Check is properly configured
// import { getToken } from 'firebase/app-check';
// import { appCheck } from '../config/firebase';

export async function appCheckFetch(url: string, init?: RequestInit): Promise<Response> {
  // App Check disabled — pass through as plain fetch
  return fetch(url, init);
}
