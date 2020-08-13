import reducerRegistry from '@onaio/redux-reducer-registry';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Store } from 'redux';
import {
  HIDDEN_PLAN_STATUSES,
  SUPERSET_MDA_POINT_REPORTING_PLANS_SLICE,
} from '../../../../configs/env';
import { MDA_POINT_PLANS } from '../../../../configs/lang';
import { QUERY_PARAM_TITLE, REPORT_MDA_POINT_PLAN_URL } from '../../../../constants';
import { getPlanStatusToDisplay, getQueryParams } from '../../../../helpers/utils';
import { RouteParams } from '../../../../helpers/utils';
import supersetFetch from '../../../../services/superset';
import MDAPointPlansReducer, {
  fetchMDAPointPlans,
  makeMDAPointPlansArraySelector,
  MDAPointPlan,
  reducerName as MDAPointPlansReducerName,
} from '../../../../store/ducks/generic/MDAPointPlans';
import { GenericPlanListProps, GenericPlansList } from '../../GenericPlansList';

/** register the MDA plan definitions reducer */
reducerRegistry.register(MDAPointPlansReducerName, MDAPointPlansReducer);

/** a list of plan statuses to be displayed */
const allowedPlanStatusList = getPlanStatusToDisplay(HIDDEN_PLAN_STATUSES);

/** Simple component that loads a preview list of MDA plans */
const MDAPointPlansList = (props: GenericPlanListProps & RouteComponentProps) => {
  return (
    <div>
      <GenericPlansList {...props} />
    </div>
  );
};

/** Declare default props for MDAPointPlansList */
const defaultProps: GenericPlanListProps = {
  fetchPlans: fetchMDAPointPlans,
  pageTitle: MDA_POINT_PLANS,
  pageUrl: REPORT_MDA_POINT_PLAN_URL,
  plans: [],
  service: supersetFetch,
  supersetReportingSlice: SUPERSET_MDA_POINT_REPORTING_PLANS_SLICE,
};

MDAPointPlansList.defaultProps = defaultProps;

export { MDAPointPlansList };

/** Connect the component to the store */

/** interface to describe props from mapStateToProps */
interface DispatchedStateProps extends RouteComponentProps<RouteParams> {
  plans: MDAPointPlan[];
}

/** map state to props */
const mapStateToProps = (
  state: Partial<Store>,
  ownProps: RouteComponentProps<RouteParams>
): DispatchedStateProps => {
  const searchedTitle = getQueryParams(ownProps.location)[QUERY_PARAM_TITLE] as string;
  const MDAPointPlansArray = makeMDAPointPlansArraySelector()(state, {
    plan_title: searchedTitle,
    statusList: allowedPlanStatusList,
  });

  return {
    ...ownProps,
    plans: MDAPointPlansArray,
  };
};

/** map dispatch to props */
const mapDispatchToProps = { fetchPlans: fetchMDAPointPlans };

/** Connected ActiveFI component */
const ConnectedMDAPointPlansList = connect(mapStateToProps, mapDispatchToProps)(MDAPointPlansList);

export default ConnectedMDAPointPlansList;