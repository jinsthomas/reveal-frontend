/** Accordion like component that can be used on the manage plans
 * page to display case Details
 */
import reducerRegistry from '@onaio/redux-reducer-registry';
import { FlexObject } from 'gisida';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import { ActionCreator, Store } from 'redux';
import Loading from '../../../../../components/page/Loading';
import { OPENSRP_API_BASE_URL } from '../../../../../configs/env';
import {
  CASE_DETAILS,
  CASE_INFORMATION,
  CASE_NUMBER,
  FAILED_TO_GET_EVENT_ID,
} from '../../../../../configs/lang';
import { OPENSRP_FIND_EVENTS_ENDPOINT } from '../../../../../constants';
import { displayError } from '../../../../../helpers/errors';
import { growl } from '../../../../../helpers/utils';
import { OpenSRPService } from '../../../../../services/opensrp';
import eventReducer, {
  fetchEvents,
  FetchEventsAction,
  getEventById,
  reducerName,
} from '../../../../../store/ducks/opensrp/events';
import {
  Event,
  RawEvent,
  translateEvent,
  UUID,
} from '../../../../../store/ducks/opensrp/events/utils';

reducerRegistry.register(reducerName, eventReducer);

/** describes props to be passed to caseDetail component */
export interface CaseDetailsProps {
  eventId: UUID | null;
  service: typeof OpenSRPService;
  event: Event | null;
  fetchEventsCreator: ActionCreator<FetchEventsAction>;
}

/** initial props for caseDetails */
const defaultCaseDetailsProps: CaseDetailsProps = {
  event: null,
  eventId: null,
  fetchEventsCreator: fetchEvents,
  service: OpenSRPService,
};

/** async function to load a single event
 * @param {UUID} eventId - id of the event to get
 * @param {OpenSRPService} servant - the opensrp service
 * @param {ActionCreator<FetchEventsAction>} actionCreator - the actionCreator
 */
const loadEvent = async (
  eventId: UUID,
  servant: typeof OpenSRPService,
  actionCreator: ActionCreator<FetchEventsAction>
) => {
  const service = new servant(OPENSRP_FIND_EVENTS_ENDPOINT, OPENSRP_API_BASE_URL);
  const filterParams = {
    id: eventId,
  };
  service
    .list(filterParams)
    .then((response: RawEvent) => actionCreator([response]))
    .catch((err: Error) => displayError(err));
};

/** CaseDetails component */
export const CaseDetails: React.FC<CaseDetailsProps> = (props = defaultCaseDetailsProps) => {
  const { eventId, service, event, fetchEventsCreator } = props;
  const [isCollapsed, setCollapse] = React.useState<boolean>(false);
  const toggleCollapse = () => setCollapse(!isCollapsed);

  if (eventId === null) {
    // if eventId is null return early
    displayError(new Error(FAILED_TO_GET_EVENT_ID));
    return null;
  }

  // make a call to the events endpoint and get event
  useEffect(() => {
    loadEvent(eventId, service, fetchEventsCreator).catch((err: Error) =>
      growl(err.message, { type: toast.TYPE.ERROR })
    );
  }, []);

  if (!event) {
    return <Loading />;
  }
  const translatedEvent = translateEvent(event);
  const { caseInformation, fociInformation, caseNumber, fociInformationTitle } = translatedEvent;

  const mapObjectToElement = (obj: FlexObject) =>
    Object.entries(obj).map(([property, value], index) => {
      return (
        <tr key={index}>
          <td>{property}</td> <td>{value}</td>
        </tr>
      );
    });

  return (
    <>
      <h3>
        {CASE_NUMBER}: {caseNumber}
      </h3>
      <div id="accordion">
        <Card>
          <CardHeader onClick={toggleCollapse}>
            <h4>{CASE_DETAILS}</h4>
          </CardHeader>
          <Collapse isOpen={isCollapsed}>
            <CardBody>
              <h5 className="mb-3">{CASE_INFORMATION}</h5>
              <table className="table table-borderless">
                {mapObjectToElement(caseInformation)}
              </table>
              <hr />
              <h5 className="mb-3"> {fociInformationTitle}</h5>
              <table className="table table-borderless">
                {mapObjectToElement(fociInformation)}
              </table>
            </CardBody>
          </Collapse>
        </Card>
      </div>
    </>
  );
};

/** describes object returned by mapState */
type MapStateToProps = Pick<CaseDetailsProps, 'event'>;
/** describes mapDispatch */
type DispatchToProps = Pick<CaseDetailsProps, 'fetchEventsCreator'>;

/**
 *
 * @param {Partial<Store>} state = the store slice
 * @param {CaseDetailsProps} ownProps - the props
 */
const mapStateToProps = (state: Partial<Store>, ownProps: CaseDetailsProps): MapStateToProps => {
  const eventId = ownProps.eventId || '';
  const response = {
    event: getEventById(state, eventId),
  };
  return response;
};

const mapDispatchToProps: DispatchToProps = {
  fetchEventsCreator: fetchEvents,
};

const ConnectedCaseDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(CaseDetails);
export default ConnectedCaseDetails;
