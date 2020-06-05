import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import React from 'react';
import { OpenSRPService } from '../../../../../services/opensrp';
import UserIdSelect, { thereIsNextPage } from '../../UserIdSelect';
import { practitioners, sortedUsers, users } from './fixtures';

// tslint:disable-next-line: no-var-requires
const fetch = require('jest-fetch-mock');
jest.mock('../../../../../configs/env');

describe('src/*/forms/userIdSelect', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });

  it('renders without crashing', async () => {
    fetch.once(JSON.stringify(users)).once(JSON.stringify(practitioners));
    const props = {
      serviceClass: OpenSRPService,
    };
    const wrapper = shallow(<UserIdSelect {...props} />);
    // tslint:disable-next-line:promise-must-complete
    await new Promise<any>(resolve => new Promise<any>(resolve));
    wrapper.update();
  });

  it('renders correctly', async () => {
    fetch.once(JSON.stringify(users)).once(JSON.stringify(practitioners));
    const props = {
      serviceClass: OpenSRPService,
    };
    const wrapper = mount(<UserIdSelect {...props} />);
    // tslint:disable-next-line:promise-must-complete
    await new Promise<any>(resolve => new Promise<any>(resolve));
    wrapper.update();
    const inputSelect = wrapper.find('input');
    expect(toJson(inputSelect)).toMatchSnapshot('Selector Input');
  });

  it('calls to fetch', async () => {
    fetch.once(JSON.stringify(users)).once(JSON.stringify(practitioners));

    const props = {
      serviceClass: OpenSRPService,
    };
    mount(<UserIdSelect {...props} />);
    // tslint:disable-next-line:promise-must-complete
    await new Promise<any>(resolve => new Promise<any>(resolve));
    await flushPromises();
    await new Promise(resolve => setImmediate(resolve));
    const calls = [
      [
        'https://test.smartregister.org/opensrp/rest/user?page_size=51&start_index=0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://test.smartregister.org/opensrp/rest/practitioner',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ];
    expect(fetch.mock.calls).toEqual(calls);
  });

  it('should not reselect an already matched user', async () => {
    // users (options) shown in select dropdown
    // should not be already mapped to a practitioner entity in opensrp
    fetch.once(JSON.stringify(users)).once(JSON.stringify(practitioners));
    const props = {
      serviceClass: OpenSRPService,
    };
    const wrapper = mount(<UserIdSelect {...props} />);

    await flushPromises();
    wrapper.update();

    // now look at passed options to Select
    const selectWrapperProps = wrapper.find('Select').props();
    const selectWrapperOptions = (selectWrapperProps as any).options;

    // should be less that those passed in from the api
    expect(selectWrapperOptions.length).toEqual(users.results.length - 2);

    // we then look if the records that are missing are actually
    // those that we want missing i.e from the dropdown options
    const optionNames = selectWrapperOptions.map((option: any) => option.label);
    expect(optionNames.includes('superset-user')).toBeFalsy();
    expect(optionNames.includes('negonga.zatias')).toBeFalsy();
  });

  it('displays all users even those matched to practitioner', async () => {
    // shows all users (options) shown in select dropdown
    // if showPractitioners props is true
    fetch.once(JSON.stringify(users)).once(JSON.stringify(practitioners));
    const props = {
      serviceClass: OpenSRPService,
      showPractitioners: true,
    };
    const wrapper = mount(<UserIdSelect {...props} />);

    await flushPromises();
    wrapper.update();

    // now look at passed options to Select
    const selectWrapperProps = wrapper.find('Select').props();
    const selectWrapperOptions = (selectWrapperProps as any).options;

    expect(selectWrapperOptions.length).toEqual(users.results.length);

    const optionNames = selectWrapperOptions.map((option: any) => option.label);
    expect(optionNames.includes('superset-user')).toBeTruthy();
    expect(optionNames.includes('negonga.zatias')).toBeTruthy();
  });

  it('calls onchangeHandler callback correctly with correct arguments', async () => {
    fetch.once(JSON.stringify(users)).once(JSON.stringify(practitioners));
    const mock: any = jest.fn();
    const props = {
      onChangeHandler: mock,
      serviceClass: OpenSRPService,
    };
    const wrapper = mount(<UserIdSelect {...props} />);

    await flushPromises();
    wrapper.update();

    (wrapper.find('Select').instance() as any).selectOption({
      label: 'Drake.Ramole',
      value: '0259c0bc-78a2-4284-a7a9-d61d0005djae',
    });
    wrapper.update();

    // what is the onchangeHandler called with
    expect(mock.mock.calls).toEqual([
      [
        {
          label: 'Drake.Ramole',
          value: '0259c0bc-78a2-4284-a7a9-d61d0005djae',
        },
      ],
    ]);
  });

  it('options are sorted in descending', async () => {
    fetch.once(JSON.stringify(users)).once(JSON.stringify(practitioners));
    const props = {
      serviceClass: OpenSRPService,
    };
    const wrapper = mount(<UserIdSelect {...props} />);

    await flushPromises();
    wrapper.update();

    // now look at passed options to Select
    const selectWrapperProps = wrapper.find('Select').props();
    const selectWrapperOptions = (selectWrapperProps as any).options;
    expect(selectWrapperOptions).toEqual(sortedUsers);
  });
});

describe('src/containers/forms/PractitionerForm/UserIdSelect.utils', () => {
  it('correctly checks if there is more data', () => {
    expect(thereIsNextPage(users)).toBeFalsy();
    let mockResponse = {
      links: [
        {
          rel: 'next',
          uri: '',
        },
        {
          rel: 'prev',
          uri: '',
        },
      ],
      results: [],
    };
    expect(thereIsNextPage(mockResponse)).toBeTruthy();
    mockResponse = {
      links: [
        {
          rel: 'next',
          uri: '',
        },
      ],
      results: [],
    };
    expect(thereIsNextPage(mockResponse)).toBeTruthy();
  });
});
