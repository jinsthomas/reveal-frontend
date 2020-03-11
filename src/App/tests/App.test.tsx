import { updateExtraData } from '@onaio/session-reducer';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { OPENSRP_LOGOUT_URL } from '../../configs/env';
import { GA_ROUTE_COMPONENT, GA_WITH_TRACKER } from '../../constants';
import store from '../../store';
import App, { AppProps } from '../App';

const history = createBrowserHistory();

describe('App', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders App correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.unmount();
  });

  it('renders correctly with the default props', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    expect(wrapper.find('App').props()).toEqual({
      ga_tracking_method: GA_ROUTE_COMPONENT,
    });
    wrapper.unmount();
  });

  it('renders correctly if google anlytics approach is with tracker', () => {
    const props: AppProps = {
      ga_tracking_method: GA_WITH_TRACKER,
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <App {...props} />
        </Router>
      </Provider>
    );
    expect(wrapper.find('WithGATrackerHOC').exists()).toBeTruthy();
    wrapper.unmount();
  });

  /** @todo Tests that utilize window.open have been intentionally put at the bottom
   * since they are causing some of the tests above to fail. Investiagte why this is happening
   */
  it('logout url is set correctly Oath provider is opensrp', () => {
    window.open = jest.fn();
    store.dispatch(
      updateExtraData({
        oAuth2Data: {
          access_token: 'ec16dd21-b4f3-4ac1-8ede-e7c6f5d68c9e',
          expires_in: '3599',
          state: 'opensrp',
          token_type: 'bearer',
        },
        preferredName: 'Superset User',
        roles: ['Provider'],
        userName: 'superset-user',
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    history.push('/logout');
    expect(window.open).toBeCalledWith(OPENSRP_LOGOUT_URL);
    wrapper.unmount();
  });

  it('logout url is set correctly when oath provider is not opensrp', () => {
    window.open = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );

    history.push('/logout');
    expect(window.open).not.toBeCalled();
    wrapper.unmount();
  });
});
