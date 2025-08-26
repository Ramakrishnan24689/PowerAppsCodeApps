/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Type fixes for auto-generated dataSourcesInfo to resolve format: null issues
 */

declare module '../../.power/appschemas/dataSourcesInfo' {
  interface IApiResponseInfo {
    type: string;
    format: string | null; // Allow null format to match auto-generated schema
  }
  
  export interface IApiDefinition {
    path: string;
    method: string;
    parameters: Array<{
      name: string;
      in: string;
      required: boolean;
      type: string;
      default: any;
    }>;
    responseInfo: Record<string, IApiResponseInfo>;
  }
  
  export interface IDataSourceInfo {
    tableId: string;
    version: string;
    primaryKey: string;
    dataSourceType: string;
    apis: Record<string, IApiDefinition>;
  }
  
  export interface DataSourcesInfo {
    [key: string]: IDataSourceInfo;
  }
}
