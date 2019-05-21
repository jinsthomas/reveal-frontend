export const plan1 = {
  jurisdiction_depth: 2,
  jurisdiction_id: '3377',
  jurisdiction_name: 'NVI_439',
  jurisdiction_name_path: ['Chadiza', 'Naviluli'],
  jurisdiction_parent_id: '2944',
  jurisdiction_path: ['2939', '2944'],
  plan_fi_reason: 'Routine',
  plan_fi_status: 'A1',
  plan_id: '10f9e9fa-ce34-4b27-a961-72fab5206ab6',
  plan_status: 'active',
  plan_title: 'A1-Tha Luang Village 1 Focus 01',
};

export const plans = [plan1];

export const plansIdArray = [plan1.plan_id];

export const goal1 = {
  action_code: 'Case Confirmation',
  completed_task_count: 0,
  goal_comparator: '=',
  goal_id: 'Case_Confirmation',
  goal_unit: 'each',
  goal_value: 1,
  measure: 'Case confirmation complete',
  plan_id: '10f9e9fa-ce34-4b27-a961-72fab5206ab6',
  task_count: 0,
};

export const goal2 = {
  action_code: 'Larval Dipping',
  completed_task_count: 0,
  goal_comparator: '>=',
  goal_id: 'Larval_Dipping_Min_3_Sites',
  goal_unit: 'each',
  goal_value: 3,
  measure: 'Number of larval dipping activities',
  plan_id: '10f9e9fa-ce34-4b27-a961-72fab5206ab6',
  task_count: 2,
};

export const goal3 = {
  action_code: 'Blood Screening',
  completed_task_count: 0,
  goal_comparator: '=',
  goal_id: 'RACD_blood_screening_1km_radius',
  goal_unit: 'percent',
  goal_value: 100,
  measure: 'Percent of registered people tested',
  plan_id: '1337',
  task_count: 0,
};

export const goals = [goal1, goal2, goal3];

export const plan1Goals = [goal1, goal2];

export const goalsByPlanId = {
  '10f9e9fa-ce34-4b27-a961-72fab5206ab6': [goal1, goal2],
  '1337': [goal3],
};

export const geojson = [
  {
    geometry: {
      coordinates: [
        [
          [101.166915893555, 15.0715019595332],
          [101.165628433228, 15.069429992157],
          [101.164855957031, 15.0649130333519],
          [101.164898872375, 15.061473449978],
          [101.165843009949, 15.0585311116698],
          [101.168718338013, 15.0577022766384],
          [101.173524856567, 15.0577437184666],
          [101.179447174072, 15.0583653449216],
          [101.183996200562, 15.0589455279759],
          [101.189103126526, 15.0597743581685],
          [101.191892623901, 15.0629238834779],
          [101.191549301147, 15.0671093647448],
          [101.19086265564, 15.0727036913665],
          [101.190605163574, 15.0748170653661],
          [101.188631057739, 15.0768061040682],
          [101.185412406921, 15.0769304183694],
          [101.182150840759, 15.0772619228176],
          [101.177172660828, 15.0780906816776],
          [101.174211502075, 15.0777591785211],
          [101.172151565552, 15.0765989134045],
          [101.168503761292, 15.0753557651845],
          [101.166915893555, 15.0715019595332],
        ],
      ],
      type: 'Polygon',
    },
    jurisdiction_id: '450fc15b-5bd2-468a-927a-49cb10d3bcac',
    jurisdiction_name: 'TLv1_01',
    jurisdiction_parent_id: 'dad42fa6-b9b8-4658-bf25-bfa7ab5b16ae',
  },
  {
    geometry: {
      coordinates: [
        [
          [101.166915893555, 15.0715019595332],
          [101.165628433228, 15.069429992157],
          [101.164855957031, 15.0649130333519],
          [101.164898872375, 15.061473449978],
          [101.165843009949, 15.0585311116698],
          [101.168718338013, 15.0577022766384],
          [101.173524856567, 15.0577437184666],
          [101.179447174072, 15.0583653449216],
          [101.183996200562, 15.0589455279759],
          [101.189103126526, 15.0597743581685],
          [101.191892623901, 15.0629238834779],
          [101.191549301147, 15.0671093647448],
          [101.19086265564, 15.0727036913665],
          [101.190605163574, 15.0748170653661],
          [101.188631057739, 15.0768061040682],
          [101.185412406921, 15.0769304183694],
          [101.182150840759, 15.0772619228176],
          [101.177172660828, 15.0780906816776],
          [101.174211502075, 15.0777591785211],
          [101.172151565552, 15.0765989134045],
          [101.168503761292, 15.0753557651845],
          [101.166915893555, 15.0715019595332],
        ],
      ],
      type: 'Polygon',
    },
    jurisdiction_id: '10f9e9fa-ce34-4b27-a961-72fab5206ab6',
    jurisdiction_name: 'TLv1_01',
    jurisdiction_parent_id: 'dad42fa6-b9b8-4658-bf25-bfa7ab5b16ae',
  },
];
export const singleGeoJSON = geojson[1];
