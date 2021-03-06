import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { createBrowserHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import ConnectedUpdatePlan, { UpdatePlan } from '..';
import {
  generatePlanDefinition,
  getPlanFormValues,
} from '../../../../../components/forms/PlanForm/helpers';
import { PlanDefinition } from '../../../../../configs/settings';
import { PLAN_UPDATE_URL } from '../../../../../constants';
import store from '../../../../../store';
import { removePlanDefinitions } from '../../../../../store/ducks/opensrp/PlanDefinition';
import * as fixtures from '../../../../../store/ducks/opensrp/PlanDefinition/tests/fixtures';
import { planDefinition1, planDefinition2, updatePlanFormProps } from './fixtures';

/* tslint:disable-next-line no-var-requires */
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

jest.mock('../PlanLocationNames', () => {
  const PlanLocationNamesMock = () => <div id="Helmuth"> No plan survives enemy contact. </div>;

  return PlanLocationNamesMock;
});

describe('components/InterventionPlan/UpdatePlan', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
    jest.clearAllMocks();
    store.dispatch(removePlanDefinitions());
  });

  function getProps() {
    const mock: any = jest.fn();
    return {
      fetchPlan: mock,
      history,
      location: mock,
      match: {
        isExact: true,
        params: { id: fixtures.plans[1].identifier },
        path: `${PLAN_UPDATE_URL}/:id`,
        url: `${PLAN_UPDATE_URL}/${fixtures.plans[1].identifier}`,
      },
      plan: fixtures.plans[1] as PlanDefinition,
    };
  }

  it('renders without crashing', () => {
    fetch.mockResponseOnce(JSON.stringify(fixtures.plans[1]));
    shallow(
      <Router history={history}>
        <UpdatePlan {...getProps()} />
      </Router>
    );
  });

  it('renders plan definition list correctly', () => {
    fetch.mockResponseOnce(JSON.stringify(fixtures.plans[1]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <UpdatePlan {...getProps()} />
        </Router>
      </Provider>
    );
    expect(toJson(wrapper.find('Breadcrumb'))).toMatchSnapshot('Breadcrumb');
    expect(toJson(wrapper.find('h3.page-title'))).toMatchSnapshot('Page title');

    expect(wrapper.find('PlanForm').props()).toEqual({
      ...updatePlanFormProps,
      addPlan: expect.any(Function),
      renderLocationNames: expect.any(Function),
    });
    wrapper.unmount();
  });

  it('renders plan Location names component', () => {
    fetch.mockResponseOnce(JSON.stringify(fixtures.plans[1]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <UpdatePlan {...getProps()} />
        </Router>
      </Provider>
    );
    expect(toJson(wrapper.find('#Helmuth'))).toMatchSnapshot('Renders PlanLocation Mock');
  });

  it('pass correct data to store: API responds with array', async () => {
    // fetch with a array response
    fetch.mockResponseOnce(JSON.stringify([fixtures.plans[1]]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <UpdatePlan {...getProps()} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise<unknown>(resolve => setImmediate(resolve));
    });
    const FetchPlanSpy = jest.spyOn(wrapper.props().children.props.children.props, 'fetchPlan');
    expect(FetchPlanSpy).toHaveBeenCalledWith(fixtures.plans[1]);
    wrapper.unmount();
  });

  it('pass correct data to store: API responds with object', async () => {
    // fetch with an object response
    fetch.mockResponseOnce(JSON.stringify(fixtures.plans[1]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <UpdatePlan {...getProps()} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await new Promise<unknown>(resolve => setImmediate(resolve));
    });
    const FetchPlanSpy = jest.spyOn(wrapper.props().children.props.children.props, 'fetchPlan');
    expect(FetchPlanSpy).toHaveBeenCalledWith(fixtures.plans[1]);
  });

  it('renders case details when plan is reactive', async () => {
    fetch.once(JSON.stringify(planDefinition1));
    const props = {
      history,
      location: jest.fn(),
      match: {
        isExact: true,
        params: { id: planDefinition1.identifier },
        path: `${PLAN_UPDATE_URL}/:id`,
        url: `${PLAN_UPDATE_URL}/${planDefinition1.identifier}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUpdatePlan {...props} />
        </Router>
      </Provider>
    );
    // resolve promise to get plan into UpdatePlan state.
    await act(async () => {
      await new Promise<unknown>(resolve => setImmediate(resolve));
    });
    wrapper.update();

    // planDefinition1 is reactive thus we expect CaseDetails is rendered
    const caseDetailsIsRendered = wrapper.find('CaseDetails').length > 0;
    expect(caseDetailsIsRendered).toBeTruthy();
    wrapper.unmount();
  });

  it('Does not render case details when plan isnt reactive', async () => {
    fetch.once(JSON.stringify(planDefinition2));
    const props = {
      history,
      location: jest.fn(),
      match: {
        isExact: true,
        params: { id: planDefinition2.identifier },
        path: `${PLAN_UPDATE_URL}/:id`,
        url: `${PLAN_UPDATE_URL}/${planDefinition2.identifier}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUpdatePlan {...props} />
        </Router>
      </Provider>
    );
    // resolve promise to get plan into UpdatePlan state.
    await act(async () => {
      await new Promise<unknown>(resolve => setImmediate(resolve));
    });
    wrapper.update();

    // planDefinition2 is not reactive thus we don't expect CaseDetails to be rendered
    const caseDetailsIsntRendered = wrapper.find('CaseDetails').length === 0;
    expect(caseDetailsIsntRendered).toBeTruthy();
    wrapper.unmount();
  });

  it('Updated plan is added to store if call to API is 200', async () => {
    const plan = fixtures.plans[1];
    fetch.mockResponseOnce(JSON.stringify(plan));

    const props = {
      history,
      location: jest.fn(),
      match: {
        isExact: true,
        params: { id: plan.identifier },
        path: `${PLAN_UPDATE_URL}/:id`,
        url: `${PLAN_UPDATE_URL}/${plan.identifier}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUpdatePlan {...props} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await new Promise<unknown>(resolve => setImmediate(resolve));
    });
    wrapper.update();

    /**@todo Simulate input change did not work. So the workaround was to clear the store of
     * plan definitions before submit. The best implementation is to simulate input change
     * and assert that the store gets updated with that change
     */
    store.dispatch(removePlanDefinitions());
    expect(store.getState().PlanDefinition).toEqual({
      planDefinitionsById: {},
    });

    wrapper.find('form').simulate('submit');

    await new Promise<any>(resolve => setImmediate(resolve));
    wrapper.update();

    const payload = {
      ...generatePlanDefinition(getPlanFormValues(plan)),
      version: 2,
    };

    expect(store.getState().PlanDefinition).toEqual({
      planDefinitionsById: {
        [plan.identifier]: payload,
      },
    });
  });

  it('Updated plan is NOT added to store if call to API is NOT 200', async () => {
    const plan = fixtures.plans[1];
    fetch.mockRejectOnce(() => Promise.reject('API is down'));

    const props = {
      history,
      location: jest.fn(),
      match: {
        isExact: true,
        params: { id: plan.identifier },
        path: `${PLAN_UPDATE_URL}/:id`,
        url: `${PLAN_UPDATE_URL}/${plan.identifier}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUpdatePlan {...props} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await new Promise<unknown>(resolve => setImmediate(resolve));
    });
    wrapper.update();

    /**@todo Simulate input change did not work. So the workaround was to clear the store of
     * plan definitions before submit. The best implementation is to simulate input change
     * and assert that the store gets updated with that change
     */
    store.dispatch(removePlanDefinitions());
    expect(store.getState().PlanDefinition).toEqual({
      planDefinitionsById: {},
    });

    wrapper.find('form').simulate('submit');

    await new Promise<any>(resolve => setImmediate(resolve));
    wrapper.update();

    expect(store.getState().PlanDefinition).toEqual({
      planDefinitionsById: {},
    });
  });
});
