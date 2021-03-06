import { Dictionary } from '@onaio/utils/dist/types/types';
import intersect from 'fast_array_intersect';
import { get, keyBy, values } from 'lodash';
import { AnyAction, Store } from 'redux';
import { createSelector } from 'reselect';
import SeamlessImmutable from 'seamless-immutable';
import { ENABLED_PLAN_TYPES } from '../../../../configs/env';
import { PlanDefinition } from '../../../../configs/settings';
import { descendingOrderSort, isPlanDefinitionOfType } from '../../../../helpers/utils';
import { InterventionType } from '../../plans';

/** the reducer name */
export const reducerName = 'PlanDefinition';

// actions

/** PLAN_DEFINITION_FETCHED action type */
export const PLAN_DEFINITIONS_FETCHED =
  'reveal/reducer/opensrp/PlanDefinition/PLAN_DEFINITIONS_FETCHED';

/** PLAN_DEFINITION_FETCHED action type */
export const REMOVE_PLAN_DEFINITIONS =
  'reveal/reducer/opensrp/PlanDefinition/REMOVE_PLAN_DEFINITIONS';

/** PLAN_DEFINITION_FETCHED action type */
export const ADD_PLAN_DEFINITION = 'reveal/reducer/opensrp/PlanDefinition/ADD_PLAN_DEFINITION';

/** interface for fetch PlanDefinitions action */
export interface FetchPlanDefinitionsAction extends AnyAction {
  planDefinitionsById: { [key: string]: PlanDefinition };
  type: typeof PLAN_DEFINITIONS_FETCHED;
}

/** interface for removing PlanDefinitions action */
export interface RemovePlanDefinitionsAction extends AnyAction {
  planDefinitionsById: { [key: string]: PlanDefinition };
  type: typeof REMOVE_PLAN_DEFINITIONS;
}

/** interface for adding a single PlanDefinitions action */
export interface AddPlanDefinitionAction extends AnyAction {
  planObj: PlanDefinition;
  type: typeof ADD_PLAN_DEFINITION;
}

/** Create type for PlanDefinition reducer actions */
export type PlanDefinitionActionTypes =
  | FetchPlanDefinitionsAction
  | RemovePlanDefinitionsAction
  | AddPlanDefinitionAction
  | AnyAction;

// action creators

/**
 * Fetch Plan Definitions action creator
 * @param {PlanDefinition[]} planList - list of plan definition objects
 */
export const fetchPlanDefinitions = (
  planList: PlanDefinition[] = []
): FetchPlanDefinitionsAction => ({
  planDefinitionsById: keyBy(planList, 'identifier'),
  type: PLAN_DEFINITIONS_FETCHED,
});

/** Reset plan definitions state action creator */
export const removePlanDefinitions = () => ({
  planDefinitionsById: {},
  type: REMOVE_PLAN_DEFINITIONS,
});

/**
 * Add one Plan Definition action creator
 * @param {PlanDefinition} planObj - the plan definition object
 */
export const addPlanDefinition = (planObj: PlanDefinition): AddPlanDefinitionAction => ({
  planObj,
  type: ADD_PLAN_DEFINITION,
});

// the reducer

/** interface for PlanDefinition state */
interface PlanDefinitionState {
  planDefinitionsById: { [key: string]: PlanDefinition } | {};
}

/** immutable PlanDefinition state */
export type ImmutablePlanDefinitionState = PlanDefinitionState &
  SeamlessImmutable.ImmutableObject<PlanDefinitionState>;

/** initial PlanDefinition state */
const initialState: ImmutablePlanDefinitionState = SeamlessImmutable({
  planDefinitionsById: {},
});

/** the PlanDefinition reducer function */
export default function reducer(
  state = initialState,
  action: PlanDefinitionActionTypes
): ImmutablePlanDefinitionState {
  switch (action.type) {
    case PLAN_DEFINITIONS_FETCHED:
      if (action.planDefinitionsById) {
        return SeamlessImmutable({
          ...state,
          planDefinitionsById: { ...state.planDefinitionsById, ...action.planDefinitionsById },
        });
      }
      return state;
    case ADD_PLAN_DEFINITION:
      if (action.planObj as PlanDefinition) {
        return SeamlessImmutable({
          ...state,
          planDefinitionsById: {
            ...state.planDefinitionsById,
            [action.planObj.identifier as string]: action.planObj,
          },
        });
      }
      return state;
    case REMOVE_PLAN_DEFINITIONS:
      return SeamlessImmutable({
        ...state,
        planDefinitionsById: action.planDefinitionsById,
      });
    default:
      return state;
  }
}

// selectors

/** get PlanDefinitions by id
 * @param {Partial<Store>} state - the redux store
 * @param {InterventionType | null} interventionType - the PlanDefinition intervention Type
 * @returns {{ [key: string]: PlanDefinition }} PlanDefinitions by id
 */
export function getPlanDefinitionsById(
  state: Partial<Store>,
  interventionType: InterventionType | null = null
): { [key: string]: PlanDefinition } {
  if (interventionType) {
    return keyBy(getPlanDefinitionsArray(state, interventionType), 'identifier');
  }
  return (state as any)[reducerName].planDefinitionsById;
}

/** get one PlanDefinition using its id
 * @param {Partial<Store>} state - the redux store
 * @param {string} id - the PlanDefinition id
 * @returns {PlanDefinition|null} a PlanDefinition object or null
 */
export function getPlanDefinitionById(state: Partial<Store>, id: string): PlanDefinition | null {
  return get((state as any)[reducerName].planDefinitionsById, id) || null;
}

/** get an array of PlanDefinition objects
 * @param {Partial<Store>} state - the redux store
 * @param {InterventionType | null} interventionType - the PlanDefinition intervention Type
 * @returns {PlanDefinition[]} an array of PlanDefinition objects
 */
export function getPlanDefinitionsArray(
  state: Partial<Store>,
  interventionType: InterventionType | null = null
): PlanDefinition[] {
  const result = values((state as any)[reducerName].planDefinitionsById);
  if (interventionType) {
    return result.filter((e: PlanDefinition) => isPlanDefinitionOfType(e, interventionType));
  }
  return result;
}

/** RESELECT USAGE STARTS HERE */

/** This interface represents the structure of plan definition filter options/params */
export interface PlanDefinitionFilters {
  title?: string /** plan object title */;
  planIds?: string[] | null /** return only plans whose id appear here */;
}

/** planDefinitionsByIdBaseSelector selects store slice object with of all plans
 * @param state - the redux store
 */
export const planDefinitionsByIdBaseSelector = (planKey?: string) => (
  state: Partial<Store>
): Dictionary<PlanDefinition> =>
  (state as any)[reducerName][planKey ? planKey : 'planDefinitionsById'];

/** planDefinitionsArrayBaseSelector select an array of all plans
 * @param state - the redux store
 */
export const planDefinitionsArrayBaseSelector = (planKey?: string) => (
  state: Partial<Store>
): PlanDefinition[] =>
  values((state as any)[reducerName][planKey ? planKey : 'planDefinitionsById']);

/** getPlanDefinitionsArrayByTitle
 * Gets title from PlanFilters
 * @param state - the redux store
 * @param props - the plan filters object
 */
export const getTitle = (_: Partial<Store>, props: PlanDefinitionFilters) => props.title;

/** getPlanDefinitionsArrayByTitle
 * Gets title from PlanFilters
 * @param state - the redux store
 * @param props - the plan filters object
 */
export const getPlanIds = (_: Partial<Store>, props: PlanDefinitionFilters) => props.planIds;

/** getPlansArrayByTitle
 * Gets an array of Plan objects filtered by plan title
 * @param {Registry} state - the redux store
 * @param {PlanDefinitionFilters} props - the plan definition filters object
 */
export const getPlanDefinitionsArrayByTitle = (planKey?: string) =>
  createSelector([planDefinitionsArrayBaseSelector(planKey), getTitle], (plans, title) =>
    title ? plans.filter(plan => plan.title.toLowerCase().includes(title.toLowerCase())) : plans
  );

/** get plans for the given planIds
 * @param {Registry} state - the redux store
 * @param {PlanDefinitionFilters} props - the plan definition filters object
 */
export const getPlanDefinitionsArrayByPlanIds = (planKey?: string) => {
  return createSelector(
    planDefinitionsByIdBaseSelector(planKey),
    planDefinitionsArrayBaseSelector(planKey),
    getPlanIds,
    (plansByIds, allPlans, planIds) => {
      const plansOfInterest = planIds ? planIds.map(planId => plansByIds[planId]) : allPlans;
      return plansOfInterest;
    }
  );
};

/**
 * filters plan definitions based on intervention type
 * @param {PlanDefinition} plans - plans to filter
 * @param {string[]} filters - list of intervention types to filter against
 */
export const FilterPlanDefinitionsByInterventionType = (
  plans: PlanDefinition[],
  filters: string[] = ENABLED_PLAN_TYPES
) => {
  return plans.filter(
    plan =>
      plan.useContext.filter(
        context =>
          context.code === 'interventionType' && filters.includes(context.valueCodableConcept)
      ).length > 0
  );
};

/** getPlanDefinitionsArrayByInterventionType
 * Gets an array of Plan objects filtered by intervention type
 * @param {Registry} state - the redux store
 * @param {PlanDefinitionFilters} props - the plan definition filters object
 */
export const getPlanDefinitionsArrayByInterventionType = (planKey?: string) => {
  return createSelector(planDefinitionsArrayBaseSelector(planKey), plans =>
    FilterPlanDefinitionsByInterventionType(plans)
  );
};

/** makePlanDefinitionsArraySelector
 * Returns a selector that gets an array of IRSPlan objects filtered by one or all
 * of the following:
 *    - title
 *    - planIds
 *
 * These filter params are all optional and are supplied via the prop parameter.
 *
 * This selector is meant to be a memoized replacement for getPlanDefinitionsArray.
 *
 * To use this selector, do something like:
 *    const PlanDefinitionsArraySelector = makeIRSPlansArraySelector();
 *
 * @param {Partial<Store>} state - the redux store
 * @param {PlanFilters} props - the plan filters object
 * @param {string} sortField - sort by field
 */
export const makePlanDefinitionsArraySelector = (
  planKey?: keyof PlanDefinitionState,
  sortField?: keyof PlanDefinition
) => {
  return createSelector(
    [
      getPlanDefinitionsArrayByInterventionType(planKey),
      getPlanDefinitionsArrayByTitle(planKey),
      getPlanDefinitionsArrayByPlanIds(planKey),
    ],
    (plans1, plans2, plans3) => {
      let finalPlans = intersect([plans1, plans2, plans3], JSON.stringify);
      if (sortField) {
        finalPlans = descendingOrderSort(finalPlans, sortField);
      }
      return finalPlans;
    }
  );
};
