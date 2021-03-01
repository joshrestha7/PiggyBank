import React from 'react';
import { PlaidLink } from 'react-plaid-link';
import { connect } from 'react-redux';
import { setAccessToken } from '../side-effects/linkSideEffects'

const Link = ({ credentials, linkToken, saveAccessToken }) => {
  return (
    <PlaidLink       
      token={linkToken}
      onSuccess={publicToken => saveAccessToken(credentials.id, credentials.email, publicToken)}>
        Connect to a bank account
    </PlaidLink>
  );
}

const mapDispatchToProps = dispatch => ({
  saveAccessToken: (id, email, publicToken) => dispatch(setAccessToken(id, email, publicToken))
});

export default connect(null, mapDispatchToProps)(Link);
