import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DrillDownTable, { DrillDownProps, DropDownCell } from '@onaio/drill-down-table';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { keyBy } from 'lodash';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { Store } from 'redux';
import HeaderBreadcrumbs, {
  BreadCrumbProps,
} from '../../../../../components/page/HeaderBreadcrumb/HeaderBreadcrumb';
import Loading from '../../../../../components/page/Loading';
import { SUPERSET_JURISDICTIONS_DATA_SLICE } from '../../../../../configs/env';
import {
  ADMN0_PCODE,
  CountriesAdmin0,
  JurisdictionsByCountry,
} from '../../../../../configs/settings';
import {
  ACTIVE_IRS_PLAN_URL,
  HOME,
  HOME_URL,
  INTERVENTION_IRS_URL,
  IRS_REPORTING_TITLE,
  MAP,
} from '../../../../../constants';
import {
  getAncestorJurisdictionIds,
  getChildlessChildrenIds,
  getChildrenByParentId,
} from '../../../../../helpers/hierarchy';
import {
  FlexObject,
  preventDefault,
  RouteParams,
  stopPropagationAndPreventDefault,
} from '../../../../../helpers/utils';
import supersetFetch from '../../../../../services/superset';
import jurisdictionReducer, {
  fetchJurisdictions,
  getJurisdictionsById,
  Jurisdiction,
  reducerName as jurisdictionReducerName,
} from '../../../../../store/ducks/jurisdictions';
import { getPlanRecordById, PlanRecord } from '../../../../../store/ducks/plans';
import { TableCrumb } from '../plan';
/** register the plans reducer */
reducerRegistry.register(jurisdictionReducerName, jurisdictionReducer);

/** interface to describe props for IrsReport component */
export interface IrsReportProps {
  fetchJurisdictionsActionCreator: typeof fetchJurisdictions;
  jurisdictionsById: { [key: string]: Jurisdiction };
  planById: PlanRecord | null;
  planId: string;
  supersetService: typeof supersetFetch;
}

/** default props for IrsReport component */
export const defaultIrsReportProps: IrsReportProps = {
  fetchJurisdictionsActionCreator: fetchJurisdictions,
  jurisdictionsById: {},
  planById: null,
  planId: '',
  supersetService: supersetFetch,
};

export interface IrsReportState {
  childlessChildrenIds: string[];
  childrenByParentId: { [key: string]: string[] };
  country: JurisdictionsByCountry | null;
  doRenderTable: boolean;
  filteredJurisdictionIds: string[];
  focusJurisdictionId: string | null;
  isLoadingHierarchy: boolean;
  isLoadingPlanData: boolean;
  reportTableProps: DrillDownProps<any> | null;
  tableCrumbs: TableCrumb[];
}

export const defaultIrsReportState: IrsReportState = {
  childlessChildrenIds: [],
  childrenByParentId: {},
  country: null,
  doRenderTable: false,
  filteredJurisdictionIds: [],
  focusJurisdictionId: null,
  isLoadingHierarchy: true,
  isLoadingPlanData: false,
  reportTableProps: null,
  tableCrumbs: [],
};

/** Reporting for Single Active IRS Plan */
class IrsReport extends React.Component<RouteComponentProps<RouteParams> & IrsReportProps, {}> {
  public static defaultProps = defaultIrsReportProps;
  public state = defaultIrsReportState;

  public async componentDidMount() {
    const {
      fetchJurisdictionsActionCreator,
      jurisdictionsById: JurisdictionsById,
      planById,
      supersetService,
    } = this.props;

    // get Jurisdicitons from Store or Superset
    const jurisdictionsArray = Object.keys(JurisdictionsById).length
      ? Object.keys(JurisdictionsById).map(j => JurisdictionsById[j])
      : await supersetService(SUPERSET_JURISDICTIONS_DATA_SLICE, { row_limit: 10000 }).then(
          (jurisdictionResults: FlexObject[] = []) => {
            // GET FULL JURISDICTION HIERARCHY
            const jurArray: Jurisdiction[] = jurisdictionResults
              .map(j => {
                const { id, parent_id, name, geographic_level } = j;
                const jurisdiction: Jurisdiction = {
                  geographic_level: geographic_level || 0,
                  jurisdiction_id: id,
                  name: name || null,
                  parent_id: parent_id || null,
                };
                return jurisdiction;
              })
              .sort((a, b) =>
                a.geographic_level && b.geographic_level
                  ? b.geographic_level - a.geographic_level
                  : 0
              );

            fetchJurisdictionsActionCreator(jurArray);
            return jurArray;
          }
        );

    const jurisdictionsById = Object.keys(JurisdictionsById).length
      ? JurisdictionsById
      : keyBy(jurisdictionsArray, j => j.jurisdiction_id);

    if (planById && planById.plan_jurisdictions_ids) {
      // build and store decendant jurisdictions, jurisdictionsArray MUST be sorted by geographic_level from high to low
      const childrenByParentId = getChildrenByParentId(jurisdictionsArray);

      // define level 0 Jurisdiction as parentlessParent
      const filteredJurisdictionIds = getAncestorJurisdictionIds(
        [...planById.plan_jurisdictions_ids],
        jurisdictionsArray
      );
      const parentlessParentId =
        filteredJurisdictionIds.find(
          a =>
            jurisdictionsById[a] &&
            !jurisdictionsById[a].parent_id &&
            !jurisdictionsById[a].geographic_level
        ) || '';

      const childlessChildrenIds = getChildlessChildrenIds(
        filteredJurisdictionIds.map(j => jurisdictionsById[j])
      );

      // define contry based on parentlessParentId
      const countryPcode: string | undefined = Object.keys(CountriesAdmin0).find(c => {
        const thisCountry: JurisdictionsByCountry = CountriesAdmin0[c as ADMN0_PCODE];
        return thisCountry.jurisdictionId.length
          ? thisCountry.jurisdictionId === parentlessParentId
          : thisCountry.jurisdictionIds.includes(parentlessParentId);
      });
      const country: JurisdictionsByCountry | null =
        CountriesAdmin0[countryPcode as ADMN0_PCODE] || null;

      // build first TableCrumb based on the country settings
      const tableCrumbs: TableCrumb[] = [
        {
          active: true,
          id: country && country.jurisdictionId.length ? country.jurisdictionId : null,
          label: country ? country.ADMN0_EN : '',
        },
      ];

      // update the component state
      this.setState(
        {
          childlessChildrenIds,
          childrenByParentId,
          country,
          filteredJurisdictionIds,
          focusJurisdictionId: parentlessParentId.length ? parentlessParentId : null,
          isLoadingHierarchy: false,
          tableCrumbs,
        },
        () => {
          // use the updated component state to construct drilldown props
          const reportTableProps = this.getDrilldownReportTableProps(this.state);

          // update component state with new reportTableProps
          this.setState({
            doRenderTable: true,
            reportTableProps,
          });
        }
      );
    }
  }

  public render() {
    const { planById, planId } = this.props;
    const { doRenderTable, isLoadingHierarchy, reportTableProps, tableCrumbs } = this.state;

    // Build page-level Breadcrumbs
    const homePage = {
      label: HOME,
      url: HOME_URL,
    };
    const breadCrumbProps: BreadCrumbProps = {
      currentPage: {
        label: (planById && planById.plan_title) || 'Loading...',
      },
      pages: [
        homePage,
        {
          label: IRS_REPORTING_TITLE,
          url: INTERVENTION_IRS_URL,
        },
      ],
    };

    // todo - redirect somewhere useful
    if (!planById) {
      return (
        <div className="mb-5">
          <Helmet>
            <title>Plan Not Found</title>
          </Helmet>
          <HeaderBreadcrumbs {...breadCrumbProps} />
          <h2 className="page-title">Loading Plan: {planId}</h2>
          <Loading />
        </div>
      );
    }

    // Build DrilldownTable breadcrumbs - todo: modularize via getter
    const onTableBreadCrumbClick = (e: React.MouseEvent) => {
      this.onTableBreadCrumbClick(e);
    };
    const tableBreadCrumbs = (
      <ol className="table-bread-crumbs breadcrumb">
        {tableCrumbs.map((crumb, i) => {
          const { active, id, label } = crumb;
          return (
            <li key={i} className="breadcrumb-item">
              {active ? (
                label
              ) : (
                <a
                  className={`table-bread-crumb-link`}
                  href=""
                  id={id || 'null'}
                  onClick={onTableBreadCrumbClick}
                >
                  {label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    );

    return (
      <div className="mb-5">
        <Helmet>
          <title>IRS Reporting | {planById.plan_title}</title>
        </Helmet>
        <HeaderBreadcrumbs {...breadCrumbProps} />
        <Row>
          <Col>
            <h2 className="page-title">IRS Plan: {planById.plan_title}</h2>
            {isLoadingHierarchy && (
              <div>
                <Loading />
                <div style={{ textAlign: 'center' }}>Loading Location Hierarchy</div>
              </div>
            )}
            {doRenderTable && reportTableProps && (
              <div>
                {tableBreadCrumbs}
                <DrillDownTable {...reportTableProps} />
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }

  /**********************
   * GETTERS
   * *********************/

  /** getDrilldownReportTableProps - getter for hierarchical DrilldownTable props
   * @param {IrsReportState} state - component state
   * @returns {DrillDownProps<any>|null} - compatible object for DrillDownTable props or null
   */
  private getDrilldownReportTableProps(state: IrsReportState): DrillDownProps<any> | null {
    const { childlessChildrenIds, filteredJurisdictionIds, focusJurisdictionId } = state;
    const { jurisdictionsById, planById, planId } = this.props;
    const filteredJurisdictions = filteredJurisdictionIds.map(j => jurisdictionsById[j]);
    if (!planById || !planById.plan_jurisdictions_ids) {
      return null;
    }

    // a simple interface for the the drilldown table data extending Jurisdiciton - todo: add props from Superset data
    interface JurisdictionRow extends Jurisdiction {
      isChildless: boolean;
    }

    // table click handler when table row is clicked
    const onDrilldownClick = (e: React.MouseEvent) => {
      if (e && e.currentTarget && e.currentTarget.id) {
        if (this.state.childlessChildrenIds.includes(e.currentTarget.id)) {
          stopPropagationAndPreventDefault(e);
        } else {
          this.onDrilldownClick(e.currentTarget.id);
        }
      }
    };

    // data to be used in the tableProps - todo: join data from Superset
    const data: JurisdictionRow[] = filteredJurisdictions.map((j: Jurisdiction) => ({
      ...j,
      id: j.jurisdiction_id,
      isChildless: childlessChildrenIds.includes(j.jurisdiction_id),
    }));

    // reporting specific columns - todo: add metrics from superset!
    const columns = [
      {
        Header: 'Location',
        columns: [
          {
            Header: '',
            accessor: (j: JurisdictionRow) => (
              <span
                id={j.jurisdiction_id}
                onClick={onDrilldownClick}
                className={`plan-jurisdiction-name${!j.isChildless ? ' btn-link' : ''}`}
              >
                {j.isChildless && (
                  <span>
                    <Link to={`${ACTIVE_IRS_PLAN_URL}/${planId}/${MAP}/${j.jurisdiction_id}`}>
                      <FontAwesomeIcon icon={['fas', MAP]} />
                    </Link>
                    &nbsp;&nbsp;
                  </span>
                )}

                {j.name}
              </span>
            ),
            id: 'name',
          },
        ],
      },
    ];

    // determine if there should be pagination depending on number of rows
    let showPagination: boolean = false;
    if (focusJurisdictionId) {
      const directDescendants = filteredJurisdictions.filter(
        j => j.parent_id === focusJurisdictionId
      );
      showPagination = directDescendants.length > 20;
    }

    // define the actual DrillDownProps to be handed to the table
    const tableProps: DrillDownProps<any> = {
      CellComponent: DropDownCell,
      columns,
      data,
      identifierField: 'jurisdiction_id',
      linkerField: 'name',
      minRows: 0,
      parentIdentifierField: 'parent_id',
      rootParentId: focusJurisdictionId,
      showPageSizeOptions: false,
      showPagination,
      useDrillDownTrProps: true,
    };

    return tableProps;
  }

  /**********************
   * EVENT HANDLERS
   * *********************/

  /** onTableBreadCrumbClick - handler for drilldown table breadcrumb clicks to reset the table hierarchy
   * @param {MouseEvent} e - event object from clicking the table breadcrumb
   */
  private onTableBreadCrumbClick(e: React.MouseEvent) {
    preventDefault(e);
    if (e && e.currentTarget && e.currentTarget.id) {
      // const clickedTableCrumb = this.state.tableCrumbs.find(c => c.id === e.currentTarget.id);
      this.onResetDrilldownTableHierarchy(e.currentTarget.id);
    }
  }

  /** onResetDrilldownTableHierarchy - function for resetting drilldown table hierachy baseline
   * @param {string|null} Id - the id of the highest level parent_idto show in the table, or null to reset completely
   */
  private onResetDrilldownTableHierarchy(Id: string | null) {
    const id = Id !== 'null' ? Id : null;
    const { tableCrumbs } = this.state;
    const nextActiveCrumbIndex = tableCrumbs.map(c => c.id).indexOf(id) + 1;
    const nextCrumbs = tableCrumbs.map(c => ({ ...c, active: false }));
    nextCrumbs.splice(nextActiveCrumbIndex);
    nextCrumbs[nextCrumbs.length - 1].active = true;

    this.setState(
      {
        doRenderTable: false,
        focusJurisdictionId: id,
        tableCrumbs: nextCrumbs,
      },
      () => {
        const planTableProps = this.getDrilldownReportTableProps(this.state);
        this.setState({
          doRenderTable: true,
          planTableProps,
        });
      }
    );
  }

  /** onDrilldownClick - function to update the drilldown breadcrumbs when drilling down into the hierarchy
   * @param {string} id - the jurisdiction_id of the Jurisdiction clicked
   */
  private onDrilldownClick(id: string) {
    const { tableCrumbs } = this.state;
    const { jurisdictionsById } = this.props;

    // build new tableCrumb for Jurisdiction which was just clicked
    const newCrumb: TableCrumb | null =
      (jurisdictionsById[id] && {
        active: true,
        id,
        label: jurisdictionsById[id].name || 'Jurisdiction',
      }) ||
      null;

    if (newCrumb) {
      // rebuild tableCrumbs
      const newCrumbs: TableCrumb[] = tableCrumbs.map(c => ({
        ...c,
        active: false,
      }));

      // add the new breadcrumb to the list of breadcrumbs
      newCrumbs.push(newCrumb);

      // update component state with new focusJurisdictionId and tableCrumbs
      this.setState({
        focusJurisdictionId: (id as string) || null,
        tableCrumbs: [...newCrumbs],
      });
    }
  }
}

export { IrsReport };

/** map state to props
 * @param {partial<store>} - the redux store
 * @param {any} ownProps - props on the component
 * @returns {IrsReportProps}
 */
const mapStateToProps = (state: Partial<Store>, ownProps: any): IrsReportProps => {
  const jurisdictionsById = getJurisdictionsById(state);
  const planId = ownProps.match.params.id || '';
  const planById = planId.length ? getPlanRecordById(state, planId) : null;
  const props = {
    jurisdictionsById,
    planById,
    planId,
    ...ownProps,
  };

  return props as IrsReportProps;
};

/** map props to actions that may be dispatched by component */
const mapDispatchToProps = {
  fetchJurisdictionsActionCreator: fetchJurisdictions,
};

/** Create connected IrsReport */
const ConnectedIrsReport = connect(
  mapStateToProps,
  mapDispatchToProps
)(IrsReport);

export default ConnectedIrsReport;