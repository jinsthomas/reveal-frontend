import { isAuthenticated } from '@onaio/session-reducer';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { Store } from 'redux';
import { DISABLE_LOGIN_RPOTECTION, LOGIN_URL } from '../../constants';

/** interface for PrivateRoute props */
interface PrivateRouteProps extends RouteProps {
  authenticated: boolean /** is the current user authenticated */;
  disableLoginProtection: boolean /** should we disable login protection */;
  redirectPath: string /** redurect to this path is use if not authenticated */;
}

/** declare default props for PrivateRoute */
const defaultPrivateRouteProps: Partial<PrivateRouteProps> = {
  authenticated: false,
  disableLoginProtection: DISABLE_LOGIN_RPOTECTION,
  redirectPath: LOGIN_URL,
};

/** The PrivateRoute component
 * This component is a simple wrapper around Route and takes all its props in
 * addition to:
 *  1. {bool} authenticated
 *  2. {string} redirectPath
 *
 * If authenticated === true then render the component supplied
 * Otherwise redirect to the redirectPath
 */
const PrivateRoute = (props: PrivateRouteProps) => {
  const {
    component: Component,
    authenticated,
    disableLoginProtection,
    redirectPath,
    ...theOtherProps
  } = props;
  return (
    /* tslint:disable jsx-no-lambda */
    <Route
      {...theOtherProps}
      render={routeProps =>
        (authenticated === true || disableLoginProtection === true) && Component ? (
          <Component {...routeProps} />
        ) : (
          <Redirect to={redirectPath} />
        )
      }
    />
    /* tslint:enable jsx-no-lambda */
  );
};

PrivateRoute.defaultProps = defaultPrivateRouteProps;

export { PrivateRoute }; // export the un-connected component

/** Connect the component to the store */

/** map state to props */
const mapStateToProps = (state: Partial<Store>, ownProps: Partial<PrivateRouteProps>) => {
  const result = {
    authenticated: isAuthenticated(state),
  };
  Object.assign(result, ownProps);

  return result;
};

/** create connected component */

/** The ConnectedPrivateRoute component
 * This component is a simple wrapper around Route and takes all its props in
 * addition to:
 *  1. {bool} authenticated - this comes from the Redux store
 *  2. {string} redirectPath
 *
 * If authenticated === true then render the component supplied
 * Otherwise redirect to the redirectPath
 */
const ConnectedPrivateRoute = connect(
  mapStateToProps,
  null
)(PrivateRoute);

export default ConnectedPrivateRoute;
