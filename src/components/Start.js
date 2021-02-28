import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCredentials, getLinkToken } from '../selectors/startSelectors';
import { getCurrentAuthCredentials, createLinkToken } from '../side-effects/startSideEffects';
import Link from './Link';

const Start = ({ credentials, loadCredentials, getLink, linkToken }) => {
  useEffect(() => {
    loadCredentials();
    getLink(credentials.id);
  }, []);
  return (
    <header className="App-header">
      Hello
      <Link linkToken={linkToken}/>
    </header>
  );
}

const mapStateToProps = state => ({
  credentials: getCredentials(state),
  linkToken: getLinkToken(state)
});

const mapDispatchToProps = dispatch => ({
  loadCredentials: () => dispatch(getCurrentAuthCredentials()),
  getLink: id => dispatch(createLinkToken(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Start);
