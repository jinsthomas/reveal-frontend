import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { raNchelengeNode } from '../../../../../../components/TreeWalker/tests/fixtures';
import { plans } from '../../../../../../store/ducks/opensrp/PlanDefinition/tests/fixtures';
import { defaultAssignmentProps } from '../../JurisdictionAssignmentForm';
import { assignment4 } from '../../JurisdictionAssignmentForm/tests/fixtures';
import { EditOrgs } from '../index';

const pastPlan = {
  ...plans[1],
  effectivePeriod: { start: '2019-07-10', end: '2000-07-30' },
};
const futurePlan = {
  ...plans[1],
  effectivePeriod: { start: '2019-07-10', end: '3030-07-30' },
};

const submitMock: any = jest.fn();
const growlMock: any = jest.fn();

const props = {
  defaultValue: [{ label: 'Team X', value: 'x' }],
  existingAssignments: [assignment4],
  jurisdiction: raNchelengeNode,
  options: [
    { label: 'Team X', value: 'x' },
    { label: 'Team Y', value: 'y' },
  ],
  submitCallBackFunc: submitMock,
  successNotifierBackFunc: growlMock,
};

describe('PlanAssignment/EditOrgs', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('works as expected', async () => {
    if (!raNchelengeNode) {
      fail();
    }

    const EditOrgrops = {
      ...props,
      plan: futurePlan,
    };

    const wrapper = mount(<EditOrgs {...EditOrgrops} />);

    // initially there is just a button JurisdictionAssignmentForm
    expect(toJson(wrapper.find('button.show-form'))).toMatchSnapshot('Show form button');
    expect(wrapper.find('JurisdictionAssignmentForm').length).toEqual(0);

    // button should not be disabled
    expect(wrapper.find('button.show-form').hasClass('disabled')).toBeFalsy();

    // we can click the button to show the form
    await act(async () => {
      (wrapper.find('button.show-form').props() as any).onClick();
      await flushPromises();
      wrapper.update();
    });

    // now there is no show form button, but there is a form
    // note that there are other buttons, from the form
    expect(wrapper.find('button.show-form').length).toEqual(0);
    expect(wrapper.find('JurisdictionAssignmentForm').length).toEqual(1);
    expect(wrapper.find('JurisdictionAssignmentForm').props()).toEqual({
      ...EditOrgrops,
      assignTeamsLabel: 'Assign Teams',
      cancelCallBackFunc: expect.any(Function),
      labels: defaultAssignmentProps.labels,
    });

    // we can click the close button form to go back to before
    await act(async () => {
      (wrapper.find('button.cancel').props() as any).onClick();
      await flushPromises();
      wrapper.update();
    });

    // voila
    expect(wrapper.find('button.show-form').length).toEqual(1);
    expect(wrapper.find('JurisdictionAssignmentForm').length).toEqual(0);

    wrapper.unmount();
  });

  it('works as expected with for plans with past dates', async () => {
    const div = document.createElement('button');
    div.setAttribute('id', 'jurisiction-dfb858b5-b3e5-4871-9d1c-ae2f3fa83b63');
    document.body.appendChild(div);

    const EditOrgrops = {
      ...props,
      plan: pastPlan,
    };

    const wrapper = mount(<EditOrgs {...EditOrgrops} />);

    // initially there is just a button JurisdictionAssignmentForm
    expect(toJson(wrapper.find('button.show-form'))).toMatchSnapshot('Show form button');
    expect(wrapper.find('JurisdictionAssignmentForm').length).toEqual(0);

    // button is disabled
    expect(wrapper.find('button.show-form').hasClass('disabled')).toBeTruthy();

    expect(wrapper.find('.tool-tip').length).toMatchInlineSnapshot(`2`);

    // let see what happens on clicking assign teams button
    await act(async () => {
      (wrapper.find('button.show-form').props() as any).onClick();
      wrapper.update();
    });

    // nothing happens
    expect(wrapper.find('JurisdictionAssignmentForm').length).toEqual(0);
    expect(wrapper.find('button.show-form').length).toEqual(1);
  });
});
