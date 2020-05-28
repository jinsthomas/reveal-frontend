import reducerRegistry from '@onaio/redux-reducer-registry';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import 'react-table/react-table.css';
import { Store } from 'redux';
import {
  SUPERSET_IRS_REPORTING_FOCUS_AREAS_COLUMNS,
  SUPERSET_IRS_REPORTING_JURISDICTIONS_COLUMNS,
  SUPERSET_IRS_REPORTING_JURISDICTIONS_FOCUS_AREA_LEVEL,
  SUPERSET_MDA_POINT_REPORTING_JURISDICTIONS_DATA_SLICES,
  SUPERSET_MDA_POINT_REPORTING_PLANS_SLICE,
} from '../../../../configs/env';
import { MDA_POINT_REPORTING_TITLE } from '../../../../configs/lang';
import { REPORT_MDA_POINT_PLAN_URL } from '../../../../constants';
import '../../../../helpers/tables.css';
import { RouteParams } from '../../../../helpers/utils';
import MDAPointPlansReducer, {
  reducerName as MDAPointPlansReducerName,
} from '../../../../store/ducks/generic/mdaPointPlan';
import {
  fetchMDAPointPlans,
  getMDAPointPlanById,
} from '../../../../store/ducks/generic/mdaPointPlan';
import ConnectedJurisdictionReport from '../../IRS/JurisdictionsReport';
import '../../IRS/JurisdictionsReport/style.css';

/** register the reducers */
reducerRegistry.register(MDAPointPlansReducerName, MDAPointPlansReducer);

/** IRS Jurisdictions props */
export interface GenericJurisdictionProps {
  currentBaseURL: string;
  currentPageTitle: string;
  fetchPlans: typeof fetchMDAPointPlans;
  focusAreaColumn: string;
  focusAreaLevel: string;
  getPlanById: typeof getMDAPointPlanById;
  jurisdictionColumn: string;
  reportingPlanSlice: string;
  slices: string[];
  ownProps: any;
}

/** Renders IRS Jurisdictions reports */
const MdaPointJurisdictionReport = (
  props: GenericJurisdictionProps & RouteComponentProps<RouteParams>
) => {
  const {
    currentBaseURL,
    currentPageTitle,
    fetchPlans,
    focusAreaColumn,
    focusAreaLevel,
    getPlanById,
    jurisdictionColumn,
    reportingPlanSlice,
    slices,
    ownProps,
  } = props;

  const jurisdictionReportprops = {
    ...ownProps,
    currentBaseURL,
    currentPageTitle,
    focusAreaColumn,
    focusAreaLevel,
    getPlanById,
    jurisdictionColumn,
    newFetchPlan: fetchPlans,
    reportingPlanSlice,
    slices,
  };

  return (
    <div>
      <ConnectedJurisdictionReport {...jurisdictionReportprops} />
    </div>
  );
};

const defaultProps: GenericJurisdictionProps = {
  currentBaseURL: REPORT_MDA_POINT_PLAN_URL,
  currentPageTitle: MDA_POINT_REPORTING_TITLE,
  fetchPlans: fetchMDAPointPlans,
  focusAreaColumn: SUPERSET_IRS_REPORTING_FOCUS_AREAS_COLUMNS,
  focusAreaLevel: SUPERSET_IRS_REPORTING_JURISDICTIONS_FOCUS_AREA_LEVEL,
  getPlanById: getMDAPointPlanById,
  jurisdictionColumn: SUPERSET_IRS_REPORTING_JURISDICTIONS_COLUMNS,
  ownProps: {},
  reportingPlanSlice: SUPERSET_MDA_POINT_REPORTING_PLANS_SLICE,
  slices: SUPERSET_MDA_POINT_REPORTING_JURISDICTIONS_DATA_SLICES.split(','),
};

MdaPointJurisdictionReport.defaultProps = defaultProps;

export { MdaPointJurisdictionReport };

/** Connect the component to the store */

/** interface to describe props from mapStateToProps */
interface DispatchedStateProps {
  ownProps: any;
}

/** map state to props */
const mapStateToProps = (
  _: Partial<Store>,
  ownProps: RouteComponentProps<RouteParams>
): DispatchedStateProps => {
  return {
    ownProps,
  };
};

/** map dispatch to props */
const mapDispatchToProps = {
  fetchPlans: fetchMDAPointPlans,
};

/** Connected ActiveFI component */
const ConnectedMdaPointJurisdictionReport = connect(
  mapStateToProps,
  mapDispatchToProps
)(MdaPointJurisdictionReport);

export default ConnectedMdaPointJurisdictionReport;
