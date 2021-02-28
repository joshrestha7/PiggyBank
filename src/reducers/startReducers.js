import { SET_AUTH_CREDENTIALS, SET_LINK_TOKEN } from '../actions/startActions';

const initialState = {credentials: {}};

export const user = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case SET_AUTH_CREDENTIALS: 
            const { credentials } = payload;
            return {...state, credentials: credentials};
        case SET_LINK_TOKEN:
            const { linkToken: linkTokenValue } = payload;
            return {...state, linkToken: linkTokenValue}
        default:    
            return state;
    }
}