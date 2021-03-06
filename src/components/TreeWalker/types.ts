import { Geometry } from '@turf/turf';
import { TreeNode } from '../../store/ducks/opensrp/hierarchies/types';

/** The shape of a jurisdiction received from the OpenSRP API */
export interface OpenSRPJurisdiction {
  id: string;
  geometry?: Geometry;
  properties: {
    code?: string;
    geographicLevel: number;
    name: string;
    parentId?: string;
    status: string;
    version: string | number;
  };
  serverVersion: number;
  type: 'Feature';
}

/** Object containing known API endpoints by name */
export interface APIEndpoints {
  [key: string]: string;
}

/** Convenient type for either an array of jurisdictions or of tree nodes */
export type TreeNodeType = OpenSRPJurisdiction | TreeNode;
