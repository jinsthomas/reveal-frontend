import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faExternalLinkSquareAlt, faMap } from '@fortawesome/free-solid-svg-icons';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import {
  AuthorizationGrantType,
  ConnectedLogout,
  ConnectedOauthCallback,
  OauthLogin,
} from '@onaio/gatekeeper';
import { logOutUser } from '@onaio/session-reducer';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router';
import { toast } from 'react-toastify';
import { Col, Container, Row } from 'reactstrap';
import CustomConnectedAPICallBack from '../components/page/CustomCallback';
import Loading from '../components/page/Loading';
import WithGATracker, { initGoogleAnalytics } from '../components/page/WithGATracker';
import {
  BACKEND_ACTIVE,
  EXPRESS_OAUTH_LOGOUT_URL,
  OPENSRP_LOGOUT_URL,
  OPENSRP_OAUTH_STATE,
  TOAST_AUTO_CLOSE_DELAY,
  WEBSITE_NAME,
} from '../configs/env';
import { DISABLE_LOGIN_PROTECTION } from '../configs/env';
import { providers } from '../configs/settings';
import {
  ACTIVE_IRS_PLAN_URL,
  ASSIGN_PLAN_URL,
  ASSIGN_PRACTITIONERS_URL,
  CREATE_ORGANIZATION_URL,
  CREATE_PRACTITIONER_URL,
  DRAFT_IRS_PLAN_URL,
  EDIT_ORGANIZATION_URL,
  EDIT_PRACTITIONER_URL,
  FI_FILTER_URL,
  FI_SINGLE_MAP_URL,
  FI_SINGLE_URL,
  FI_URL,
  INTERVENTION_IRS_DRAFTS_URL,
  INTERVENTION_IRS_URL,
  LOGIN_URL,
  LOGOUT_URL,
  MAP,
  NEW_IRS_PLAN_URL,
  NEW_PLAN_URL,
  OAUTH_CALLBACK_PATH,
  OAUTH_CALLBACK_URL,
  ORGANIZATIONS_LIST_URL,
  PLAN_COMPLETION_URL,
  PLAN_LIST_URL,
  PLAN_UPDATE_URL,
  PRACTITIONERS_LIST_URL,
  REACT_CALLBACK_PATH,
  REACT_LOGIN_URL,
  REPORT_IRS_PLAN_URL,
  SINGLE_ORGANIZATION_URL,
} from '../constants';
import ConnectedHeader from '../containers/ConnectedHeader';
import ActiveFocusInvestigation from '../containers/pages/FocusInvestigation/active';
import FIJurisdiction from '../containers/pages/FocusInvestigation/jurisdiction';
import SingleActiveFIMap from '../containers/pages/FocusInvestigation/map/active';
import ConnectedPlanCompletion from '../containers/pages/FocusInvestigation/map/planCompletion';
import Home from '../containers/pages/Home/Home';
import IrsPlans from '../containers/pages/InterventionPlan/IRS';
import IrsPlan from '../containers/pages/InterventionPlan/IRS/plan';
import NewPlan from '../containers/pages/InterventionPlan/NewPlan/General';
import NewIRSPlan from '../containers/pages/InterventionPlan/NewPlan/IRS';
import ConnectedPlanDefinitionList from '../containers/pages/InterventionPlan/PlanDefinitionList';
import ConnectedUpdatePlan from '../containers/pages/InterventionPlan/UpdatePlan';
import ConnectedIRSAssignmentPlansList from '../containers/pages/IRS/assignments';
import ConnectedJurisdictionReport from '../containers/pages/IRS/JurisdictionsReport';
import ConnectedIRSReportingMap from '../containers/pages/IRS/Map';
import ConnectedIRSPlansList from '../containers/pages/IRS/plans';
import ConnectedAssignPractitioner from '../containers/pages/OrganizationViews/AssignPractitioners';
import ConnectedCreateEditOrgView from '../containers/pages/OrganizationViews/CreateEditOrgView';
import ConnectedOrgsListView from '../containers/pages/OrganizationViews/OrganizationListView';
import ConnectedSingleOrgView from '../containers/pages/OrganizationViews/SingleOrganizationView';
import ConnectedCreateEditPractitionerView from '../containers/pages/PractitionerViews/CreateEditPractitioner';
import ConnectedPractitionersListView from '../containers/pages/PractitionerViews/PractitionerListView';
import { oAuthUserInfoGetter } from '../helpers/utils';
import store from '../store';
import { getOauthProviderState } from '../store/selectors';
import './App.css';

library.add(faMap);
library.add(faUser);
library.add(faExternalLinkSquareAlt);
toast.configure({
  autoClose: TOAST_AUTO_CLOSE_DELAY /** defines how long a toast remains visible on screen */,
});
initGoogleAnalytics();

const APP_CALLBACK_URL = BACKEND_ACTIVE ? OAUTH_CALLBACK_URL : REACT_LOGIN_URL;
const { IMPLICIT, AUTHORIZATION_CODE } = AuthorizationGrantType;
const AuthGrandType = BACKEND_ACTIVE ? AUTHORIZATION_CODE : IMPLICIT;
const APP_LOGIN_URL = BACKEND_ACTIVE ? LOGIN_URL : REACT_LOGIN_URL;
const APP_CALLBACK_PATH = BACKEND_ACTIVE ? OAUTH_CALLBACK_PATH : REACT_CALLBACK_PATH;

/** Main App component */
class App extends Component {
  public render() {
    return (
      <Container fluid={true}>
        <Helmet titleTemplate={`%s | ` + WEBSITE_NAME} defaultTitle="" />
        <ConnectedHeader />
        <Container fluid={true}>
          <Row id="main-page-row">
            <Col>
              <Switch>
                {/* Home Page view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path="/"
                  component={WithGATracker(Home)}
                />
                {/* Active IRS Plans list view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={INTERVENTION_IRS_URL}
                  ConnectedOrgTeamView={true}
                  component={WithGATracker(IrsPlans)}
                />
                {/* Draft IRS Plans list view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={INTERVENTION_IRS_DRAFTS_URL}
                  component={WithGATracker(IrsPlans)}
                />
                {/* New IRS Plan form view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={NEW_IRS_PLAN_URL}
                  component={WithGATracker(NewIRSPlan)}
                />
                {/* Draft IRS Plan Jurisdiction Selection view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${DRAFT_IRS_PLAN_URL}/:id`}
                  component={WithGATracker(IrsPlan)}
                />
                {/* Draft IRS Plan Team Assignment view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${ACTIVE_IRS_PLAN_URL}/:id`}
                  component={WithGATracker(IrsPlan)}
                />
                {/* IRS Reporting plan table view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={REPORT_IRS_PLAN_URL}
                  component={WithGATracker(ConnectedIRSPlansList)}
                />
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${REPORT_IRS_PLAN_URL}/:planId`}
                  component={WithGATracker(ConnectedJurisdictionReport)}
                />
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${REPORT_IRS_PLAN_URL}/:planId/:jurisdictionId`}
                  component={WithGATracker(ConnectedJurisdictionReport)}
                />
                {/* IRS Reporting Map view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${REPORT_IRS_PLAN_URL}/:planId/:jurisdictionId/${MAP}`}
                  component={WithGATracker(ConnectedIRSReportingMap)}
                />
                {/* IRS Assignment views */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${ASSIGN_PLAN_URL}`}
                  component={WithGATracker(ConnectedIRSAssignmentPlansList)}
                />
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${ASSIGN_PLAN_URL}/:id`}
                  component={WithGATracker(IrsPlan)}
                />
                {/* Focus Investigation Reporting list view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={FI_URL}
                  component={WithGATracker(ActiveFocusInvestigation)}
                />
                {/* Focus Area detail view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${FI_SINGLE_URL}/:jurisdictionId`}
                  component={WithGATracker(FIJurisdiction)}
                />
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${FI_FILTER_URL}/:jurisdiction_parent_id/:plan_id?`}
                  component={WithGATracker(ActiveFocusInvestigation)}
                />
                {/* Focus Investigation completion confirmation view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${PLAN_COMPLETION_URL}/:id`}
                  component={WithGATracker(ConnectedPlanCompletion)}
                />
                {/* Focus Investigation Reporting map view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${FI_SINGLE_MAP_URL}/:id/`}
                  component={WithGATracker(SingleActiveFIMap)}
                />
                {/* Focus Investigation Reporting map view (with goal layers) */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${FI_SINGLE_MAP_URL}/:id/:goalId`}
                  component={WithGATracker(SingleActiveFIMap)}
                />
                {/* New Focus Investigation Plan form view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={NEW_PLAN_URL}
                  component={WithGATracker(NewPlan)}
                />
                {/* Edit Focus Investigation Plan form view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${PLAN_UPDATE_URL}/:id`}
                  component={WithGATracker(ConnectedUpdatePlan)}
                />
                {/* Manage Plans list view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={PLAN_LIST_URL}
                  component={WithGATracker(ConnectedPlanDefinitionList)}
                />
                {/** Organization list view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={ORGANIZATIONS_LIST_URL}
                  component={WithGATracker(ConnectedOrgsListView)}
                />
                {/** organization create view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={CREATE_ORGANIZATION_URL}
                  component={WithGATracker(ConnectedCreateEditOrgView)}
                />
                {/** Organization edit view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${EDIT_ORGANIZATION_URL}/:id`}
                  component={WithGATracker(ConnectedCreateEditOrgView)}
                />
                {/* single organization view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${SINGLE_ORGANIZATION_URL}/:id`}
                  component={WithGATracker(ConnectedSingleOrgView)}
                />
                {/* single organization view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${SINGLE_ORGANIZATION_URL}/:id`}
                  component={WithGATracker(ConnectedSingleOrgView)}
                />
                {/* Practitioner listing page */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={PRACTITIONERS_LIST_URL}
                  component={WithGATracker(ConnectedPractitionersListView)}
                />
                {/** practitioner create view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={CREATE_PRACTITIONER_URL}
                  component={WithGATracker(ConnectedCreateEditPractitionerView)}
                />
                {/** Practitioner edit view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${EDIT_PRACTITIONER_URL}/:id`}
                  component={WithGATracker(ConnectedCreateEditPractitionerView)}
                />
                {/** Assign practitioners to organization view */}
                />
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={`${ASSIGN_PRACTITIONERS_URL}/:id`}
                  component={WithGATracker(ConnectedAssignPractitioner)}
                />
                {/* tslint:disable jsx-no-lambda */}
                <Route
                  exact={true}
                  path={APP_LOGIN_URL}
                  render={routeProps => (
                    <OauthLogin
                      providers={providers}
                      authorizationGrantType={AuthGrandType}
                      {...routeProps}
                    />
                  )}
                />
                <Route
                  exact={true}
                  path={APP_CALLBACK_PATH}
                  render={routeProps => {
                    if (BACKEND_ACTIVE) {
                      return <CustomConnectedAPICallBack {...routeProps} />;
                    }
                    return (
                      <ConnectedOauthCallback
                        LoadingComponent={Loading}
                        providers={providers}
                        oAuthUserInfoGetter={oAuthUserInfoGetter}
                        {...routeProps}
                      />
                    );
                  }}
                />
                {/* tslint:enable jsx-no-lambda */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={DISABLE_LOGIN_PROTECTION}
                  exact={true}
                  path={LOGOUT_URL}
                  // tslint:disable-next-line: jsx-no-lambda
                  component={() => {
                    if (BACKEND_ACTIVE) {
                      store.dispatch(logOutUser());
                      window.location.href = EXPRESS_OAUTH_LOGOUT_URL;
                      return <></>;
                    }
                    const state = getOauthProviderState(store.getState());
                    return (
                      <ConnectedLogout
                        {...{
                          logoutURL: state === OPENSRP_OAUTH_STATE ? OPENSRP_LOGOUT_URL : null,
                        }}
                      />
                    );
                  }}
                />
              </Switch>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

export default App;
