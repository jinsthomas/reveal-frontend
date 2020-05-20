import reducerRegistry from '@onaio/redux-reducer-registry';
import { keyBy } from 'lodash';
import { FlushThunks } from 'redux-testkit';
import { PlanDefinition } from '../../../../../configs/settings';
import store from '../../../../index';
import { InterventionType } from '../../../plans';
import reducer, {
  addPlanDefinition,
  fetchPlanDefinitions,
  getPlanDefinitionById,
  getPlanDefinitionsArray,
  getPlanDefinitionsArrayByTitle,
  getPlanDefinitionsById,
  makePlanDefinitionsArraySelector,
  reducerName,
  removePlanDefinitions,
} from '../index';
import * as fixtures from './fixtures';

reducerRegistry.register(reducerName, reducer);

describe('reducers/opensrp/PlanDefinition', () => {
  let flushThunks;

  beforeEach(() => {
    flushThunks = FlushThunks.createMiddleware();
    jest.resetAllMocks();
    store.dispatch(removePlanDefinitions());
  });

  it('should have initial state', () => {
    expect(getPlanDefinitionsArray(store.getState())).toEqual([]);
    expect(getPlanDefinitionById(store.getState(), '356b6b84-fc36-4389-a44a-2b038ed2f38d')).toEqual(
      null
    );
    expect(getPlanDefinitionsById(store.getState())).toEqual({});
  });

  it('Fetches plan definitions correctly', () => {
    // action creators dispatch
    store.dispatch(fetchPlanDefinitions(fixtures.plans as PlanDefinition[]));

    expect(getPlanDefinitionsArray(store.getState())).toEqual(fixtures.plans);
    expect(getPlanDefinitionById(store.getState(), '356b6b84-fc36-4389-a44a-2b038ed2f38d')).toEqual(
      fixtures.plans[0]
    );
    expect(getPlanDefinitionsById(store.getState())).toEqual(keyBy(fixtures.plans, 'identifier'));

    // filter by intervention type
    expect(getPlanDefinitionsArray(store.getState(), InterventionType.FI)).toEqual([
      fixtures.plans[0],
      fixtures.plans[2],
      fixtures.plans[3],
    ]);
    expect(getPlanDefinitionsArray(store.getState(), InterventionType.IRS)).toEqual([
      fixtures.plans[1],
    ]);

    expect(getPlanDefinitionsById(store.getState(), InterventionType.IRS)).toEqual(
      keyBy([fixtures.plans[1]], 'identifier')
    );
    expect(getPlanDefinitionsById(store.getState(), InterventionType.FI)).toEqual(
      keyBy([fixtures.plans[0], fixtures.plans[2], fixtures.plans[3]], 'identifier')
    );

    // RESELECT TESTS
    const titleFilter = {
      title: 'mosh',
    };
    const titleUpperFilter = {
      title: 'MOSH',
    };
    const PlanDefinitionsArraySelector = makePlanDefinitionsArraySelector();

    expect(getPlanDefinitionsArrayByTitle()(store.getState(), titleFilter)).toEqual([
      fixtures.plans[3],
    ]);
    expect(getPlanDefinitionsArrayByTitle()(store.getState(), titleUpperFilter)).toEqual([
      fixtures.plans[3],
    ]);
    expect(PlanDefinitionsArraySelector(store.getState(), { title: 'Mosh' })).toEqual([
      fixtures.plans[3],
    ]);

    // reset
    store.dispatch(removePlanDefinitions());
    expect(getPlanDefinitionsArray(store.getState())).toEqual([]);
  });

  it('Fetching plans does not replace planDefinitionsById', () => {
    // fetch two plan definition objects
    store.dispatch(
      fetchPlanDefinitions([fixtures.plans[0], fixtures.plans[1]] as PlanDefinition[])
    );
    // we should have them in the store
    expect(getPlanDefinitionsArray(store.getState())).toEqual([
      fixtures.plans[0],
      fixtures.plans[1],
    ]);
    // fetch one more plan definition objects
    store.dispatch(fetchPlanDefinitions([fixtures.plans[3]] as PlanDefinition[]));
    // we should now have a total of three plan definition objects in the store
    expect(getPlanDefinitionsArray(store.getState())).toEqual([
      fixtures.plans[0],
      fixtures.plans[1],
      fixtures.plans[3],
    ]);
  });

  it('You can add one plan definition object to the store', () => {
    // reset
    store.dispatch(removePlanDefinitions());

    // add one plan definition objects
    store.dispatch(addPlanDefinition(fixtures.plans[2] as PlanDefinition));
    // we should have it in the store
    expect(getPlanDefinitionsArray(store.getState())).toEqual([fixtures.plans[2]]);

    // fetch one more plan definition objects
    store.dispatch(addPlanDefinition(fixtures.plans[3] as PlanDefinition));
    // we should now have a total of three plan definition objects in the store
    expect(getPlanDefinitionsArray(store.getState())).toEqual([
      fixtures.plans[2],
      fixtures.plans[3],
    ]);

    // add an existing plan again
    store.dispatch(addPlanDefinition(fixtures.plans[2] as PlanDefinition));
    // nothing should have changed in the store
    // we should now have a total of three plan definition objects in the store
    expect(getPlanDefinitionsArray(store.getState())).toEqual([
      fixtures.plans[2],
      fixtures.plans[3],
    ]);
  });
});

describe('reducers/opensrp/PlanDefinition.reselect.userNameFilter', () => {
  let flushThunks;
  const plansArraySelector = makePlanDefinitionsArraySelector();

  beforeEach(() => {
    flushThunks = FlushThunks.createMiddleware();
    jest.resetAllMocks();
    store.dispatch(removePlanDefinitions());
  });

  it('should have initial state', () => {
    const state = store.getState();
    expect(plansArraySelector(state, {})).toEqual([]);
  });

  it('userName filter works correctly', () => {
    const sampleUserName = 'user';
    store.dispatch(fetchPlanDefinitions(fixtures.plans as PlanDefinition[], sampleUserName));
    expect(plansArraySelector(store.getState(), { userName: 'nonExistent' })).toEqual([]);
    expect(plansArraySelector(store.getState(), { userName: sampleUserName })).toEqual(
      fixtures.plans
    );
    // dispatch call (x+1) should not overwrite the work done by dispatch call x.
    const anotherUserName = 'user2';
    store.dispatch(fetchPlanDefinitions([fixtures.plans[0]] as PlanDefinition[], anotherUserName));
    expect(plansArraySelector(store.getState(), { userName: anotherUserName })).toEqual([
      fixtures.plans[0],
    ]);
    expect(plansArraySelector(store.getState(), { userName: sampleUserName })).toEqual(
      fixtures.plans
    );
  });

  it('removes planDefinitions correctly', () => {
    expect(plansArraySelector(store.getState(), {})).toEqual([]);
  });
});
