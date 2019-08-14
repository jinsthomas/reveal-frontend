import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';
import LinkToNewPlans from '..';

const history = createBrowserHistory();

describe('components/LinkToNewPlans', () => {
  it('renders without crashing', () => {
    shallow(<LinkToNewPlans />);
  });

  it('Matches snapshot', () => {
    const wrapper = mount(
      <Router history={history}>
        <LinkToNewPlans />
      </Router>
    );
    expect(wrapper.find('Router').length).toEqual(1);
    expect(toJson(wrapper.find('LinkToNewPlans'))).toMatchSnapshot();
    wrapper.unmount();
  });
});
