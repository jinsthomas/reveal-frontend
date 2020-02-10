import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import React from 'react';
import PractitionerForm from '..';
import * as helpers from '../../../../helpers/utils';
import UserIdSelect from '../UserIdSelect';
import { openMRSUsers, practitioners } from '../UserIdSelect/tests/fixtures';

// tslint:disable-next-line: no-var-requires
const fetch = require('jest-fetch-mock');
jest.mock('../../../../configs/env');

describe('src/components/PractitionerForm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });
  it('renders without crashing', () => {
    fetch.once(JSON.stringify(practitioners)).once(JSON.stringify(openMRSUsers));
    shallow(<PractitionerForm />);
  });

  it('renders correctly', () => {
    fetch.once(JSON.stringify(practitioners)).once(JSON.stringify(openMRSUsers));
    // looking for each fields
    const wrapper = mount(<PractitionerForm />);

    // practitioner's name
    const practitionerInput = wrapper.find('input#name');
    expect(practitionerInput.length).toEqual(1);
    expect(toJson(practitionerInput)).toMatchSnapshot('name input');

    // async select to retrieve openMRS username
    const openmrsId = wrapper.find(UserIdSelect);
    expect(openmrsId.length).toBeGreaterThanOrEqual(1);

    // active
    const activeRadioNo = wrapper.find('input#no');
    expect(activeRadioNo.length).toEqual(1);
    expect(toJson(activeRadioNo)).toMatchSnapshot('active field no radio');

    const activeRadioYes = wrapper.find('input#yes');
    expect(activeRadioYes.length).toEqual(1);
    expect(toJson(activeRadioYes)).toMatchSnapshot('active field yes radio');
  });

  it('yup validates correctly', async () => {
    fetch.once(JSON.stringify(practitioners)).once(JSON.stringify(openMRSUsers));
    // fetch.mockResponse(JSON.stringify([]))
    // looking for each fields
    const wrapper = mount(<PractitionerForm />);

    await flushPromises();
    expect(fetch.mock.calls).toEqual([
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
    ]);

    wrapper.find('form').simulate('submit');
    await flushPromises();
    // simulate form submission
    wrapper.update();

    // confirm errors
    let nameError = wrapper.find('small.name-error');
    expect(nameError.length).toEqual(1);
    expect(toJson(nameError)).toMatchSnapshot('Name error');

    let usernameError = wrapper.find('small.userId-error');
    expect(usernameError.length).toEqual(1);
    expect(toJson(usernameError)).toMatchSnapshot('User select error');

    // fill in and see errors
    // practitioner's name
    const nameInput = wrapper.find('input#name');
    nameInput.simulate('change', { target: { name: 'name', value: 'someName' } });

    // async select to retrieve openMRS username
    const openmrsId = wrapper.find(UserIdSelect);
    (openmrsId.find('Select').instance() as any).selectOption({
      label: 'Drake.Ramole',
      value: '0259c0bc-78a2-4284-a7a9-d61d0005djae',
    });

    // tslint:disable-next-line:no-inferred-empty-object-type
    await new Promise(resolve => setImmediate(resolve));

    wrapper.update();

    nameError = wrapper.find('small.name-error');
    expect(nameError.length).toEqual(0);

    usernameError = wrapper.find('small.userId-error');
    expect(usernameError.length).toEqual(0);
  });

  it('creates object to send correctly for creating new practitioner', async () => {
    fetch.once(JSON.stringify(practitioners)).once(JSON.stringify(openMRSUsers));
    (helpers as any).generateNameSpacedUUID = jest.fn(() => 'someUUId');
    const wrapper = mount(<PractitionerForm />);

    // practitioner's name
    const nameInput = wrapper.find('input#name');
    nameInput.simulate('change', { target: { name: 'name', value: 'Joey Tribbiani' } });

    // async select to retrieve openMRS username
    const openmrsId = wrapper.find(UserIdSelect);
    (openmrsId.find('Select').instance() as any).selectOption({
      label: 'Drake.Ramole',
      value: '0259c0bc-78a2-4284-a7a9-d61d0005djae',
    });

    wrapper.find('form').simulate('submit');

    // tslint:disable-next-line:no-inferred-empty-object-type
    await new Promise(resolve => setImmediate(resolve));

    expect(fetch.mock.calls[2]).toEqual([
      'https://test.smartregister.org/opensrp/rest/practitioner',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body:
          '{"active":false,"identifier":"someUUId","name":"Joey Tribbiani","userId":"0259c0bc-78a2-4284-a7a9-d61d0005djae","username":"Drake.Ramole"}',
        headers: {
          accept: 'application/json',
          authorization: 'Bearer null',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
  });

  it('creates object to send correctly for editing practitioner', async () => {
    fetch.once(JSON.stringify(practitioners)).once(JSON.stringify(openMRSUsers));
    const props = {
      initialValues: {
        active: false,
        identifier: 'someUUId',
        name: 'Joey Tribbiani',
        userId: '0259c0bc-78a2-4284-a7a9-d61d0005djae',
        username: 'Drake.Ramole',
      },
    };
    const wrapper = mount(<PractitionerForm {...props} />);

    // practitioner's name
    const nameInput = wrapper.find('input#name');
    nameInput.simulate('change', { target: { name: 'name', value: 'that guy' } });

    expect(toJson(wrapper.find('input#username'))).toMatchSnapshot('readonly username edit');

    wrapper.find('form').simulate('submit');

    // tslint:disable-next-line:no-inferred-empty-object-type
    await new Promise(resolve => setImmediate(resolve));

    expect(fetch.mock.calls).toEqual([
      [
        'https://test.smartregister.org/opensrp/rest/practitioner',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body:
            '{"active":false,"identifier":"someUUId","name":"that guy","userId":"0259c0bc-78a2-4284-a7a9-d61d0005djae","username":"Drake.Ramole"}',
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
  });
});
