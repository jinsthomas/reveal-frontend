import { renderTable } from '@onaio/drill-down-table';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { createBrowserHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import ConnectedIRSPlansList, { IRSPlansList } from '../';
import { REPORT_IRS_PLAN_URL } from '../../../../../constants';
import store from '../../../../../store';
import { GenericPlan } from '../../../../../store/ducks/generic/plans';
import { fetchIRSPlans } from '../../../../../store/ducks/generic/plans';
import * as fixtures from '../../../../../store/ducks/generic/tests/fixtures';

jest.mock('../../../../../configs/env');
/* tslint:disable-next-line no-var-requires */
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

describe('components/IRS Reports/IRSPlansList', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without crashing', () => {
    const props = {
      history,
      location: {
        hash: '',
        pathname: REPORT_IRS_PLAN_URL,
        search: '',
        state: undefined,
      },
      match: {
        isExact: true,
        params: {},
        path: `${REPORT_IRS_PLAN_URL}/`,
        url: `${REPORT_IRS_PLAN_URL}/`,
      },
      plans: fixtures.plans as GenericPlan[],
    };
    shallow(
      <Router history={history}>
        <IRSPlansList {...props} />
      </Router>
    );
  });

  it('renders plan definition list correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const props = {
      history,
      location: {
        hash: '',
        pathname: REPORT_IRS_PLAN_URL,
        search: '',
        state: undefined,
      },
      match: {
        isExact: true,
        params: {},
        path: `${REPORT_IRS_PLAN_URL}/`,
        url: `${REPORT_IRS_PLAN_URL}/`,
      },
      plans: fixtures.plans as GenericPlan[],
    };
    const wrapper = mount(
      <Router history={history}>
        <IRSPlansList {...props} />
      </Router>
    );
    await act(async () => {
      await new Promise(resolve => setImmediate(resolve));
      wrapper.update();
    });
    expect(toJson(wrapper.find('BreadcrumbItem li'))).toMatchSnapshot('breadcrumbs');
    expect(toJson(wrapper.find('h3.page-title'))).toMatchSnapshot('page title');
    expect(toJson(wrapper.find('.thead .tr'))).toMatchSnapshot('table headers');
    expect(wrapper.find('.tbody .tr').length).toEqual(3);
    expect(wrapper.find('GenericPlansList').length).toBe(1);
    expect(wrapper.find('GenericPlansList').props()).toMatchSnapshot('GenericPlansList props');
    renderTable(wrapper, 'the full rendered rows');
    // have searchbar
    expect(wrapper.find('.search-input-wrapper').length).toEqual(1);
    // have top and bottom pagination
    expect(wrapper.find('.pagination').length).toEqual(2);
    // have height and columns filters
    expect(
      wrapper
        .find('.filter-bar-btns span')
        .at(0)
        .text()
    ).toEqual('Row Height');
    expect(
      wrapper
        .find('.filter-bar-btns span')
        .at(1)
        .text()
    ).toEqual('Customize Columns');
    wrapper.unmount();
  });

  it('handles search correctly', async () => {
    store.dispatch(fetchIRSPlans(fixtures.plans as GenericPlan[]));

    const props = {
      fetchPlans: jest.fn(),
      history,
      location: {
        pathname: REPORT_IRS_PLAN_URL,
        search: '?title=Berg',
      },
      match: {
        isExact: true,
        params: {},
        path: `${REPORT_IRS_PLAN_URL}`,
        url: `${REPORT_IRS_PLAN_URL}`,
      },
      service: jest.fn().mockImplementationOnce(() => Promise.resolve([])),
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedIRSPlansList {...props} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await new Promise(resolve => setImmediate(resolve));
      wrapper.update();
    });

    expect((wrapper.find('GenericPlansList').props() as any).plans).toMatchSnapshot(
      'search results props'
    );
    expect(
      wrapper
        .find('.tbody .tr .td a')
        .at(0)
        .text()
    ).toEqual('Berg Namibia 2019');
  });

  it('handles a case insensitive search', async () => {
    store.dispatch(fetchIRSPlans(fixtures.plans as GenericPlan[]));

    const props = {
      fetchPlans: jest.fn(),
      history,
      location: {
        pathname: REPORT_IRS_PLAN_URL,
        search: '?title=BERG',
      },
      match: {
        isExact: true,
        params: {},
        path: `${REPORT_IRS_PLAN_URL}`,
        url: `${REPORT_IRS_PLAN_URL}`,
      },
      service: jest.fn().mockImplementationOnce(() => Promise.resolve([])),
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedIRSPlansList {...props} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await new Promise(resolve => setImmediate(resolve));
      wrapper.update();
    });

    expect((wrapper.find('GenericPlansList').props() as any).plans).toMatchSnapshot(
      'search results props'
    );
  });

  it('renders empty table if no search matches', async () => {
    store.dispatch(fetchIRSPlans(fixtures.plans as GenericPlan[]));

    const props = {
      fetchPlans: jest.fn(),
      history,
      location: {
        pathname: REPORT_IRS_PLAN_URL,
        search: '?title=Amazon',
      },
      match: {
        isExact: true,
        params: {},
        path: `${REPORT_IRS_PLAN_URL}`,
        url: `${REPORT_IRS_PLAN_URL}`,
      },
      service: jest.fn().mockImplementationOnce(() => Promise.resolve([])),
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedIRSPlansList {...props} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await new Promise(resolve => setImmediate(resolve));
      wrapper.update();
    });
    expect((wrapper.find('GenericPlansList').props() as any).plans).toMatchSnapshot(
      'search results props'
    );
  });
});
