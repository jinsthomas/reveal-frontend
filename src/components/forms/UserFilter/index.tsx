import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import queryString from 'query-string';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import { FILTER, USER } from '../../../configs/lang';
import { QUERY_PARAM_USER } from '../../../constants';
import { getQueryParams } from '../../../helpers/utils';
import { OpenSRPService } from '../../../services/opensrp';
import { DropDownRenderer } from '../../DropDownRenderer';
import UserIdSelect, { Option } from '../PractitionerForm/UserIdSelect';
import './index.css';

/** props for BaseUserFilter Component */
interface BaseUserSelectFilterProps {
  onChangeHandler?: (option: Option) => void;
  serviceClass: typeof OpenSRPService;
}

/** the default props */
const defaultProps = {
  serviceClass: OpenSRPService,
};

export type BaseUserSelectFilterPropTypes = BaseUserSelectFilterProps & RouteComponentProps;

export const defaultHandler = (option: Option, props: BaseUserSelectFilterPropTypes) => {
  const targetValue = option.label;
  const allQueryParams = getQueryParams(props.location);
  // modify just the search and leave the rest
  allQueryParams[QUERY_PARAM_USER] = targetValue;

  props.history.push(`${props.match.url}?${queryString.stringify(allQueryParams)}`);
};

/** presentational component that renders a filter where you can select an user
 * that then filters plans that the user has access to.
 *
 * This component is a wrapper around the UserIdSelect component
 */
export const BaseUserSelectFilter = (props: BaseUserSelectFilterPropTypes) => {
  const onChangeHandler = (option: Option) => {
    // a custom onChangeHandler will override the default implementation
    if (props.onChangeHandler) {
      props.onChangeHandler(option);
      return;
    }
    defaultHandler(option, props);
  };

  const userIdSelectProps = {
    onChangeHandler,
    serviceClass: OpenSRPService,
    showPractitioners: true,
  };

  return (
    <DropDownRenderer
      // tslint:disable-next-line:jsx-no-lambda
      renderToggle={() => (
        <>
          <span className="mr-2">{FILTER}</span>
          <FontAwesomeIcon icon="sliders-h" />
        </>
      )}
      // tslint:disable-next-line: jsx-no-lambda
      renderMenu={() => (
        <DropdownMenu className="adhoc-filters">
          <h6>{FILTER}</h6>
          <div className="form-group row">
            <div className="col-sm-2">
              <label>{USER}</label>
            </div>
            <div className="col-sm-10">
              <UserIdSelect {...userIdSelectProps} />
            </div>
          </div>
        </DropdownMenu>
      )}
    />
  );
};

const UserSelectFilter = withRouter(BaseUserSelectFilter);
UserSelectFilter.defaultProps = defaultProps;
export { UserSelectFilter };
