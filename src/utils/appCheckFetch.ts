import { getToken } from 'firebase/app-check';
import { appCheck } from '../config/firebase';

export async function appCheckFetch(url: string, init?: RequestInit): Promise<Response> {
  const { token } = await getToken(appCheck);
  const headers = new Headers(init?.headers);
  headers.set('X-Firebase-AppCheck', token);
  return fetch(url, { ...init, headers });
}
