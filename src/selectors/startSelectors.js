import { createSelector } from 'reselect';

export const getCredentials = state => state.user.credentials;
export const getLinkToken = state => state.user.linkToken;