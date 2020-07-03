// tslint:disable: object-literal-sort-keys
export const akros2 = {
  type: 'Feature',
  id: '3952',
  properties: {
    status: 'Active',
    parentId: '3019',
    name: 'Akros_2',
    geographicLevel: 2,
    version: 2,
    OpenMRS_Id: '617e2a06-8235-4e8a-a43b-1c44f1565af8',
    username: 'dcakros1',
  },
  serverVersion: 1591971796702,
};

export const mtendere = {
  type: 'Feature',
  id: '3019',
  properties: {
    status: 'Active',
    parentId: '2942',
    name: 'Mtendere',
    geographicLevel: 1,
    version: 0,
  },
  serverVersion: 1545204913828,
};

export const lusaka = {
  type: 'Feature',
  id: '2942',
  properties: {
    status: 'Active',
    name: 'Lusaka',
    geographicLevel: 0,
    version: 0,
  },
  serverVersion: 1545204913827,
};

export const fetchCalls = [
  [
    'https://reveal-stage.smartregister.org/opensrp/rest/plans/356b6b84-fc36-4389-a44a-2b038ed2f38d',
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
    'https://reveal-stage.smartregister.org/opensrp/rest/location/findByJurisdictionIds?is_jurisdiction=true&return_geometry=false&jurisdiction_ids=3952',
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
    'https://reveal-stage.smartregister.org/opensrp/rest/location/3019?is_jurisdiction=true&return_geometry=false',
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
    'https://reveal-stage.smartregister.org/opensrp/rest/location/2942?is_jurisdiction=true&return_geometry=false',
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
