import reducerRegistry from '@onaio/redux-reducer-registry';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Col, Row } from 'reactstrap';
import { Store } from 'redux';
import {
  GenericSupersetDataTable,
  GenericSupersetDataTableProps,
} from '../../../../components/GenericSupersetDataTable';
import HeaderBreadcrumb, {
  Page,
} from '../../../../components/page/HeaderBreadcrumb/HeaderBreadcrumb';
import {
  SUPERSET_MDA_POINT_REPORTING_JURISDICTIONS_DATA_SLICES,
  SUPERSET_MDA_POINT_SCHOOL_REPORT_DATA,
} from '../../../../configs/env';
import { HOME, MDA_POINT_SCHOOL_REPORT_TITLE } from '../../../../configs/lang';
import {
  HOME_URL,
  MDA_POINT_SCHOOL_REPORT_URL,
  REPORT_MDA_POINT_PLAN_URL,
} from '../../../../constants';
import { RouteParams } from '../../../../helpers/utils';
import supersetFetch from '../../../../services/superset';
import { getGenericJurisdictionsArray } from '../../../../store/ducks/generic/jurisdictions';
import MDAPointSchoolReportReducer, {
  FetchMDAPointSchoolReportAction,
  makeMDAPointSchoolReportsArraySelector,
  reducerName as MDAPointSchoolReportReducerName,
  SchoolReport,
} from '../../../../store/ducks/generic/MDASchoolReport';

/** register the MDA point school report definitions reducer */
reducerRegistry.register(MDAPointSchoolReportReducerName, MDAPointSchoolReportReducer);

const slices = SUPERSET_MDA_POINT_REPORTING_JURISDICTIONS_DATA_SLICES.split(',');
interface SchoolReportsProps extends GenericSupersetDataTableProps {
  pageTitle: typeof MDA_POINT_SCHOOL_REPORT_TITLE;
  pageUrl: string;
  prevPage: Page | null;
}

const tableHeaders = [
  'Age Range',
  'Total SACs Registered',
  'MMA coverage',
  'MMA Coverage (%)',
  'SACs refused',
  'SACs sick/pregnant/contraindicated',
  'ADR reported (%)',
  'ADR severe (%)',
  'Alb tablets distributed',
];

const SchoolReportsList = (props: SchoolReportsProps) => {
  const {
    pageTitle,
    pageUrl,
    supersetSliceId,
    fetchItems,
    service,
    data,
    headerItems,
    tableClass,
    prevPage,
  } = props;

  const homePage = {
    label: HOME,
    url: HOME_URL,
  };

  const pages = prevPage ? [homePage, prevPage] : [homePage];
  const breadcrumbProps = {
    currentPage: {
      label: pageTitle,
      url: pageUrl,
    },
    pages,
  };

  const listViewProps: GenericSupersetDataTableProps = {
    data,
    fetchItems,
    headerItems,
    service,
    supersetSliceId,
    tableClass,
  };

  return (
    <div>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <HeaderBreadcrumb {...breadcrumbProps} />
      <Row>
        <Col md={8}>
          <h3 className="mt-3 mb-3 page-title">{pageTitle}</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <GenericSupersetDataTable {...listViewProps} />
        </Col>
      </Row>
    </div>
  );
};

/** Declare default props for MDAPointPlansList */
const defaultProps: SchoolReportsProps = {
  data: [],
  fetchItems: FetchMDAPointSchoolReportAction,
  headerItems: tableHeaders,
  pageTitle: MDA_POINT_SCHOOL_REPORT_TITLE,
  pageUrl: MDA_POINT_SCHOOL_REPORT_URL,
  prevPage: { label: '' },
  service: supersetFetch,
  supersetSliceId: SUPERSET_MDA_POINT_SCHOOL_REPORT_DATA,
  tableClass: 'table table-striped table-bordered plans-list',
};

SchoolReportsList.defaultProps = defaultProps;

export { SchoolReportsList };

interface DispatchedStateProps {
  data: React.ReactNode[][];
  pageUrl: string;
  pageTitle: string;
  prevPage: Page | null;
}

/** map state to props */
const mapStateToProps = (
  state: Partial<Store>,
  ownProps: RouteComponentProps<RouteParams>
): DispatchedStateProps => {
  const { planId, jurisdictionId } = ownProps.match.params;

  let pageUrl = MDA_POINT_SCHOOL_REPORT_URL;
  let schoolData: SchoolReport[] = [];
  let pageTitle = MDA_POINT_SCHOOL_REPORT_TITLE;
  let prevPage = null;

  if (planId && jurisdictionId) {
    // get parent jurisdiction id and name
    const jurisdictions = slices.map((slice: string) =>
      getGenericJurisdictionsArray(state, slice, planId)
    );
    let parentId = null;
    let parentName = null;
    jurisdictions.forEach(juris =>
      juris.forEach(jur => {
        if (jur.jurisdiction_id === jurisdictionId && jur.plan_id === planId) {
          parentId = jur.jurisdiction_path.length ? [...jur.jurisdiction_path].pop() : null;
          parentName = jur.jurisdiction_name_path.length
            ? [...jur.jurisdiction_name_path].pop()
            : null;
          pageTitle = `${pageTitle}: ${jur.jurisdiction_name}`;
        }
      })
    );
    if (parentId && parentName) {
      prevPage = {
        label: parentName,
        url: `${REPORT_MDA_POINT_PLAN_URL}/${planId}/${parentId}`,
      };
    }
    // build page url
    pageUrl = `${MDA_POINT_SCHOOL_REPORT_URL}/${planId}/${jurisdictionId}`;
    // get school reporting data
    schoolData = makeMDAPointSchoolReportsArraySelector(planId)(state, {
      jurisdiction_id: jurisdictionId,
    });
  }

  const data = schoolData.map(sch => {
    return [
      sch.client_age_category,
      sch.sacregistered,
      sch.mmacov,
      sch.mmacovper,
      sch.sacrefused,
      sch.sacrefmedreason,
      sch.mmaadr,
      sch.mmaadrsev,
      sch.albdist,
    ];
  });

  return {
    data,
    pageTitle,
    pageUrl,
    prevPage,
  };
};

/** map dispatch to props */
const mapDispatchToProps = { fetchItems: FetchMDAPointSchoolReportAction };

/** Connected ActiveFI component */
const ConnectedSchoolReports = connect(mapStateToProps, mapDispatchToProps)(SchoolReportsList);

export default ConnectedSchoolReports;
