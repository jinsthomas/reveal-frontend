import reducerRegistry from '@onaio/redux-reducer-registry';
import { FlushThunks } from 'redux-testkit';
import store from '../../..';
import reducer, {
  genericFetchPlans,
  genericRemovePlans,
  getPlanByIdSelector,
  getPlansArrayByTitle,
  makePlansArraySelector,
  reducerName,
} from '../MDAPlans';
import { GenericPlan } from '../plans';
import * as fixtures from './fixtures';

reducerRegistry.register(reducerName, reducer);

const plansArraySelector = makePlansArraySelector();
const defaultProps = {};

describe('reducers/MDA/Dynami-MDAPlan', () => {
  let flushThunks;

  beforeEach(() => {
    flushThunks = FlushThunks.createMiddleware();
    jest.resetAllMocks();
  });

  it('should have initial state', () => {
    expect(plansArraySelector(store.getState(), defaultProps)).toEqual([]);
    expect(getPlanByIdSelector(store.getState(), '356b6b84-fc36-4389-a44a-2b038ed2f38d')).toEqual(
      null
    );
  });

  it('Fetches plan definitions correctly', () => {
    // action creators dispatch
    store.dispatch(genericFetchPlans(fixtures.DynamicMDAPlans as GenericPlan[]));

    expect(getPlanByIdSelector(store.getState(), '40357eff-81b6-4e32-bd3d-484019689f7c')).toEqual(
      fixtures.DynamicMDAPlans[0]
    );

    // RESELECT TESTS
    const titleFilter = {
      plan_title: 'Berg',
    };
    const titleUpperFilter = {
      plan_title: 'BERG',
    };

    expect(getPlansArrayByTitle()(store.getState(), titleFilter)).toEqual([
      fixtures.DynamicMDAPlans[2],
    ]);
    expect(getPlansArrayByTitle()(store.getState(), titleUpperFilter)).toEqual([
      fixtures.DynamicMDAPlans[2],
    ]);
    expect(plansArraySelector(store.getState(), { statusList: ['retired'] })).toEqual([
      fixtures.DynamicMDAPlans[0],
    ]);
    expect(plansArraySelector(store.getState(), { statusList: ['draft'] })).toEqual([]);
    expect(
      plansArraySelector(store.getState(), { statusList: ['active'], plan_title: 'mda' })
    ).toEqual([fixtures.DynamicMDAPlans[1]]);
    // reset
    store.dispatch(genericRemovePlans());
    expect(plansArraySelector(store.getState(), defaultProps)).toEqual([]);
  });

  it('Fetching plans does not replace GenericPlansById', () => {
    // fetch two plan definition objects
    store.dispatch(
      genericFetchPlans([fixtures.DynamicMDAPlans[0], fixtures.DynamicMDAPlans[1]] as GenericPlan[])
    );
    // we should have them in the store
    expect(plansArraySelector(store.getState(), defaultProps)).toEqual([
      fixtures.DynamicMDAPlans[0],
      fixtures.DynamicMDAPlans[1],
    ]);
    // fetch one more plan definition objects
    store.dispatch(genericFetchPlans([fixtures.DynamicMDAPlans[2]] as GenericPlan[]));
    // we should now have a total of three plan definition objects in the store
    expect(plansArraySelector(store.getState(), defaultProps)).toEqual([
      fixtures.DynamicMDAPlans[0],
      fixtures.DynamicMDAPlans[1],
      fixtures.DynamicMDAPlans[2],
    ]);
  });
});