export const SET_AUTH_CREDENTIALS = 'SET_AUTH_CREDENTIALS';
export const setAuthCredentials = credentials => ({
    type: SET_AUTH_CREDENTIALS,
    payload: { credentials },
});

export const SET_LINK_TOKEN = 'SET_LINK_TOKEN';
export const setLinkToken = linkToken => ({
    type: SET_LINK_TOKEN,
    payload: { linkToken },
});