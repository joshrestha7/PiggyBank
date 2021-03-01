import { API } from "aws-amplify";

export const setAccessToken = (idValue, emailValue, publicTokenValue) => async dispatch => {
    try {
      API.put('piggybankapi', '/set-access-token', {
        body: {
          id: idValue,
          email: emailValue,
          publicToken: publicTokenValue
        }
      })
      .then(response => console.log(response));
    } catch (e) {
      console.log(e)
    }
  }