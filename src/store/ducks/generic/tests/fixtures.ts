import { InterventionType, PlanRecord, PlanStatus } from '../../plans';

export const plans = [
  {
    jurisdiction_root_parent_ids: ['f45b9380-c970-4dd1-8533-9e95ab12f128'],
    plan_date: '2019-09-05',
    plan_effective_period_end: '2019-09-25',
    plan_effective_period_start: '2019-09-05',
    plan_id: '727c3d40-e118-564a-b231-aac633e6abce',
    plan_intervention_type: 'IRS',
    plan_name: 'IRS-2019-09-05-TEST',
    plan_status: 'retired',
    plan_title: 'IRS 2019-09-05 TEST',
    plan_version: '2',
  },
  {
    jurisdiction_root_parent_ids: ['f45b9380-c970-4dd1-8533-9e95ab12f128'],
    plan_date: '2019-08-30',
    plan_effective_period_end: '2019-09-14',
    plan_effective_period_start: '2019-08-30',
    plan_id: '02e358ed-87fe-5720-8782-0afe28cb7e8c',
    plan_intervention_type: 'IRS',
    plan_name: 'IRS-2019-08-30m',
    plan_status: 'active',
    plan_title: 'IRS 2019-08-30m',
    plan_version: '2',
  },
  {
    jurisdiction_root_parent_ids: ['f45b9380-c970-4dd1-8533-9e95ab12f128'],
    plan_date: '2019-08-29',
    plan_effective_period_end: '2019-09-18',
    plan_effective_period_start: '2019-08-29',
    plan_id: 'c6e59ec1-8c54-5fdf-acf3-ee3692983f38',
    plan_intervention_type: 'IRS',
    plan_name: 'Berg-Namibia-2019',
    plan_status: 'active',
    plan_title: 'Berg Namibia 2019',
    plan_version: '2',
  },
];

export const planRecords: PlanRecord[] = [
  {
    id: '727c3d40-e118-564a-b231-aac633e6abce',
    plan_date: '2019-09-05',
    plan_effective_period_end: '2019-09-25',
    plan_effective_period_start: '2019-09-05',
    plan_fi_reason: '',
    plan_fi_status: '',
    plan_id: '727c3d40-e118-564a-b231-aac633e6abce',
    plan_intervention_type: 'IRS' as InterventionType.IRS,
    plan_status: 'retired' as PlanStatus.RETIRED,
    plan_title: 'IRS 2019-09-05 TEST',
    plan_version: '2',
  },
  {
    id: '02e358ed-87fe-5720-8782-0afe28cb7e8c',
    plan_date: '2019-08-30',
    plan_effective_period_end: '2019-09-14',
    plan_effective_period_start: '2019-08-30',
    plan_fi_reason: '',
    plan_fi_status: '',
    plan_id: '02e358ed-87fe-5720-8782-0afe28cb7e8c',
    plan_intervention_type: 'IRS' as InterventionType.IRS,
    plan_status: 'active' as PlanStatus.RETIRED,
    plan_title: 'IRS 2019-08-30m',
    plan_version: '2',
  },
  {
    id: 'c6e59ec1-8c54-5fdf-acf3-ee3692983f38',
    plan_date: '2019-08-29',
    plan_effective_period_end: '2019-09-18',
    plan_effective_period_start: '2019-08-29',
    plan_fi_reason: '',
    plan_fi_status: '',
    plan_id: 'c6e59ec1-8c54-5fdf-acf3-ee3692983f38',
    plan_intervention_type: 'IRS' as InterventionType.IRS,
    plan_status: 'active' as PlanStatus.RETIRED,
    plan_title: 'Berg Namibia 2019',
    plan_version: '2',
  },
];

// tslint:disable: object-literal-sort-keys
export const namibiaIRSJurisdictions = [
  {
    foundcoverage: 0,
    householdsnotaccessible: 0,
    id: '0001ca08-c9b7-5ea5-acc5-dc9b2fce5d24',
    jurisdiction_depth: 3,
    jurisdiction_id: 'fc6ea38c-df35-4ded-9b29-cdc7b6766cd3',
    jurisdiction_name: 'KASOTE',
    jurisdiction_name_path: ['Namibia', 'Kavango West', 'Rundu'],
    jurisdiction_parent_id: '3f017d7d-1ac0-4d6f-92d0-33bdcbeff5c4',
    jurisdiction_path: [
      'f45b9380-c970-4dd1-8533-9e95ab12f128',
      '0f39569f-3bde-4661-a933-c95218b17532',
      '3f017d7d-1ac0-4d6f-92d0-33bdcbeff5c4',
    ],
    lockedfirst: 0,
    lockedmopup: 0,
    plan_id: 'da451786-a760-4947-870c-7c9c0a818574',
    refusalsfirst: 0,
    refusalsmopup: 0,
    sprayeffectiveness: 0,
    structuresfound: 0,
    structuressprayed: 0,
    targetcoverage: 0,
    target_2019: 0,
  },
  {
    id: '00056eb5-51c3-5bd6-a216-c8da451953c1',
    plan_id: '7a4efc30-fdda-477a-96fb-589f69c57211',
    jurisdiction_id: '68d2a24b-1240-453d-b2b1-561d4a5c7016',
    jurisdiction_parent_id: '84d72939-0629-4d21-97db-c7dcbccbb7ac',
    jurisdiction_name: 'KAKUSE',
    jurisdiction_depth: 3,
    jurisdiction_path: [
      'f45b9380-c970-4dd1-8533-9e95ab12f128',
      'bd070142-aca9-4612-81d1-f3b172b8e0b8',
      '84d72939-0629-4d21-97db-c7dcbccbb7ac',
    ],
    jurisdiction_name_path: ['Namibia', 'Oshikoto', 'Tsumeb'],
    structuresfound: 0,
    structuressprayed: 0,
    targetcoverage: 0,
    sprayeffectiveness: 0,
    foundcoverage: 0,
    householdsnotaccessible: 0,
    refusalsfirst: 0,
    refusalsmopup: 0,
    lockedfirst: 0,
    lockedmopup: 0,
    target_2019: 22,
  },
  {
    foundcoverage: 0,
    householdsnotaccessible: 0,
    id: '00069466-ce9f-5340-b5af-db1a85e53c0f',
    jurisdiction_depth: 3,
    jurisdiction_id: 'd81008d3-c18b-4c80-83a8-3fcb27d318e3',

    jurisdiction_name: 'OMATUNDA A',
    jurisdiction_name_path: ['Namibia', 'Oshana', 'Oshakati'],
    jurisdiction_parent_id: '634e07d1-16dc-4207-802e-108f9008214a',
    jurisdiction_path: [
      'f45b9380-c970-4dd1-8533-9e95ab12f128',
      '8e8a3b21-c12f-4036-8482-b986ee14f274',
      '634e07d1-16dc-4207-802e-108f9008214a',
    ],
    lockedfirst: 0,
    lockedmopup: 0,
    plan_id: 'ab063b4f-bbbc-416f-880a-d465ddd7b80f',
    refusalsfirst: 0,
    refusalsmopup: 0,
    sprayeffectiveness: 0,
    structuresfound: 0,
    structuressprayed: 0,
    target_2019: 0,
    targetcoverage: 0,
  },
  {
    id: '000cc61b-85fd-5258-8d32-4bb017431c76',
    jurisdiction_depth: 3,
    jurisdiction_id: '6eed9689-ff52-405c-97dd-307a4768fdba',
    jurisdiction_name: 'OKATHAKOBAGO',
    jurisdiction_name_path: ['Namibia', 'Omusati', 'Tsandi'],
    jurisdiction_parent_id: '4e72770f-ec87-4411-bdd1-838a1304ed19',
    jurisdiction_path: [
      'f45b9380-c970-4dd1-8533-9e95ab12f128',
      'a0627554-c000-49ac-a1fc-625ecc937124',
      '4e72770f-ec87-4411-bdd1-838a1304ed19',
    ],
    plan_id: 'da451786-a760-4947-870c-7c9c0a818574',
    sprayeffectiveness: 0,
    structuresfound: 0,
    structuressprayed: 0,
    targetcoverage: 0,
    foundcoverage: 0,
    householdsnotaccessible: 0,
    lockedfirst: 0,
    lockedmopup: 0,
    refusalsfirst: 0,
    refusalsmopup: 0,
    target_2019: 0,
  },
];

export const MDAPointplans = [
  {
    jurisdiction_root_parent_ids: ['2942'],
    plan_date: '2019-09-05',
    plan_effective_period_end: '2019-09-25',
    plan_effective_period_start: '2019-09-05',
    plan_id: '40357eff-81b6-4e32-bd3d-484019689f7c',
    plan_intervention_type: 'MDA-Point',
    plan_name: 'MDA-Point-2019-09-05-TEST',
    plan_status: 'retired',
    plan_title: 'MDA-Point-2019-09-05 TEST',
    plan_version: '2',
  },
  {
    jurisdiction_root_parent_ids: ['2942'],
    plan_date: '2019-08-30',
    plan_effective_period_end: '2019-09-14',
    plan_effective_period_start: '2019-08-30',
    plan_id: '9f19b77c-b9a5-5832-a4e5-4b461d18fce7',
    plan_intervention_type: 'MDA-Point',
    plan_name: 'MDA-Point-2019-08-30m',
    plan_status: 'active',
    plan_title: 'MDA-Point-2019-08-30m',
    plan_version: '2',
  },
  {
    jurisdiction_root_parent_ids: ['2942'],
    plan_date: '2019-08-29',
    plan_effective_period_end: '2019-09-18',
    plan_effective_period_start: '2019-08-29',
    plan_id: 'c6e59ec1-8c54-5fdf-acf3-ee3692983f38',
    plan_intervention_type: 'MDA-Point',
    plan_name: 'Berg-Eswatini-2019',
    plan_status: 'active',
    plan_title: 'Berg Eswatini 2019',
    plan_version: '2',
  },
];
/* tslint:disable-next-line no-var-requires */
export const ZambiaStructures = require('../../../../containers/pages/IRS/JurisdictionsReport/tests/zambia_structures.json');
