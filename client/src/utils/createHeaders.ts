/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { AxiosRequestConfig } from 'axios';

export const createAuthHeaders = (): AxiosRequestConfig => {
  const loggedUser = window.localStorage.getItem('curUser');
  const loggedUserObject = loggedUser ? JSON.parse(loggedUser) : { token: { token: 'noTokenFoundFromLocalStorage' } };
  const { token } = loggedUserObject;

  return {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
};

export const createHeadersFromToken = (token: string): AxiosRequestConfig => ({
  headers: {
    Authorization: `Token ${token}`,
  },
});
