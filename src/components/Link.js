import React from 'react';
import { PlaidLink } from 'react-plaid-link';
import { connect } from 'react-redux';

const Link = ({ linkToken }) => {
  return (
    <PlaidLink       
      token={linkToken}
      onSuccess={accessToken=> console.log(accessToken)}>
        Connect to a bank account
    </PlaidLink>
  );
}

const mapDispatchToProps = dispatch => ({
  
});

export default connect(null, mapDispatchToProps)(Link);
