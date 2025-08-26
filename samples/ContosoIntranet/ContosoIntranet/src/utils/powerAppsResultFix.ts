// TODO: Remove when SharePoint connector bug is fixed
import type { IOperationResult } from '@pa-client/power-code-sdk/lib/';

export function fixPowerAppsResult<T>(result: any): IOperationResult<T> {
  if ('isSuccess' in result) return result;
  if ('success' in result) {
    return { isSuccess: result.success, result: result.data, error: result.error };
  }
  return { isSuccess: false, error: 'Unknown result format' };
}
