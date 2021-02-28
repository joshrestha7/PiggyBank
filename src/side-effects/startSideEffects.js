import { Auth, API } from "aws-amplify";
import { setAuthCredentials, setLinkToken } from '../actions/startActions'; 

export const getCurrentAuthCredentials = () => async dispatch => {
  try {
    const credentials = await Auth.currentAuthenticatedUser()
    .then(user => {
      return { 
        id: user.attributes.sub,
        email: user.attributes.email
       };
    });
    dispatch(setAuthCredentials(credentials))
  } catch (e) {
    console.log(e)
  }
}

export const getUser = () => async dispatch => {

}

export const createLinkToken = idValue => async dispatch => {
    try {
        const linkToken = await API.post('piggybankapi', '/create-link-token', {
          body: {
            id: idValue
          }
        })
        .then(response => {return response.linkToken});
        dispatch(setLinkToken(linkToken));
    } catch(e) {
      console.log(e)
    }
} 