import { Registry } from '@onaio/redux-reducer-registry';
import { FIReasons } from '../../../../configs/settings';
import { ObjectList } from '../../../../helpers/cbv';
import {
  InterventionType,
  makePlansArraySelector,
  PlanFilters,
  PlanStatus,
} from '../../../../store/ducks/plans';

/** Custom implementation of ObjectList where we override the getMapStateToProps method */
export default class JurisdictionList<
  ObjectType,
  ActionType,
  SelectorType,
  PropsType
> extends ObjectList<ObjectType, ActionType, SelectorType, PropsType> {
  /** Custom getMapStateToProps
   * Gets plans for the current jurisdiction
   */
  public getMapStateToProps() {
    return (state: Registry, ownProps: any) => {
      const getPlansArray = makePlansArraySelector();

      const jurisdictionId =
        '59ad4fa0-1945-4b50-a6e3-a056a7cdceb2' || ownProps.match.params.jurisdictionId;

      const caseTriggeredFilters: PlanFilters = {
        interventionType: InterventionType.FI,
        jurisdictionIds: [jurisdictionId],
        reason: FIReasons[1],
        statusList: [PlanStatus.ACTIVE, PlanStatus.COMPLETE],
      };

      const routineFilters: PlanFilters = {
        ...caseTriggeredFilters,
        reason: FIReasons[0],
      };

      return {
        caseTriggeredPlans: getPlansArray(state, caseTriggeredFilters),
        routinePlans: getPlansArray(state, routineFilters),
      };
    };
  }
}
