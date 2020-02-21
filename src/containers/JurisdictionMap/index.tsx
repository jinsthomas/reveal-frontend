import reducerRegistry from '@onaio/redux-reducer-registry';
import superset from '@onaio/superset-connector';
import React, { useEffect, useState } from 'react';
import GisidaWrapper from '../../components/GisidaWrapper';
import Loading from '../../components/page/Loading';
import { SUPERSET_JURISDICTIONS_SLICE } from '../../configs/env';
import { ObjectList } from '../../helpers/cbv';
import { displayError } from '../../helpers/errors';
import supersetFetch from '../../services/superset';
import jurisdictionReducer, {
  fetchJurisdictions,
  Jurisdiction,
  makeJurisdictionByIdSelector,
  reducerName as jurisdictionReducerName,
} from '../../store/ducks/jurisdictions';

/** register the jurisdictions reducer */
reducerRegistry.register(jurisdictionReducerName, jurisdictionReducer);

/** Interface for JurisdictionMap props */
interface JurisdictionMapProps {
  cssClass: string;
  fetchJurisdictionsActionCreator: typeof fetchJurisdictions;
  jurisdiction: Jurisdiction | null;
  jurisdictionId: string | null;
  minHeight: string;
  supersetService: typeof supersetFetch;
}

/** This component renders a map of a given jurisdiction */
const JurisdictionMap = (props: JurisdictionMapProps) => {
  const [loading, setLoading] = useState(true);
  const [errorOcurred, setErrorOcurred] = useState(false);

  const {
    cssClass,
    fetchJurisdictionsActionCreator,
    jurisdictionId,
    jurisdiction,
    minHeight,
    supersetService,
  } = props;

  /** define superset filter params for jurisdictions */
  const supersetParams = jurisdictionId
    ? superset.getFormData(1, [
        { comparator: jurisdictionId, operator: '==', subject: 'jurisdiction_id' },
      ])
    : {};

  useEffect(() => {
    supersetService(SUPERSET_JURISDICTIONS_SLICE, supersetParams)
      .then((result: Jurisdiction[]) => {
        if (result) {
          fetchJurisdictionsActionCreator(result);
        } else {
          setErrorOcurred(true);
          displayError(new Error('An error occurred'));
        }
      })
      .finally(() => setLoading(false))
      .catch(err => {
        setErrorOcurred(true);
        displayError(err);
      });
  }, []);

  if (loading === true) {
    return <Loading />;
  }

  if (errorOcurred === true) {
    return <span>something bad happened</span>;
  }

  return (
    <div className={cssClass}>
      <GisidaWrapper geoData={jurisdiction} minHeight={minHeight} />
    </div>
  );
};

/** Default props for JurisdictionMap */
export const defaultProps: JurisdictionMapProps = {
  cssClass: 'map-area',
  fetchJurisdictionsActionCreator: fetchJurisdictions,
  jurisdiction: null,
  jurisdictionId: null,
  minHeight: '200px',
  supersetService: supersetFetch,
};

JurisdictionMap.defaultProps = defaultProps;

const jurisdictionByIdSelector = makeJurisdictionByIdSelector();

/** ObjectList options */
const objectListOptions = {
  actionCreator: fetchJurisdictions,
  dispatchPropName: 'fetchJurisdictionsActionCreator',
  listPropName: 'jurisdiction',
  selector: jurisdictionByIdSelector,
};

const ConnectedJurisdictionMap = new ObjectList<
  Jurisdiction,
  any, // TODO: why does Typescript complain when we set this to FetchJurisdictionAction?
  typeof jurisdictionByIdSelector,
  JurisdictionMapProps
>(JurisdictionMap, objectListOptions);

/** This represents a fully redux-connected component that fetches data from
 * an API.
 */
export default ConnectedJurisdictionMap.render();
