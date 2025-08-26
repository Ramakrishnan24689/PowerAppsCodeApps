# SharePoint Connector Bug - Power Apps SDK

## Bug Description
SharePoint connector returns `{success, data}` but TypeScript interface expects `{isSuccess, result}`.

## Fix Pattern

### 1. Create Utility (once)
`src/utils/powerAppsResultFix.ts`:
```typescript
// TODO: Remove when SharePoint connector bug is fixed
import type { IOperationResult } from '@pa-client/power-code-sdk/lib/';

export function fixPowerAppsResult<T>(result: any): IOperationResult<T> {
  if ('isSuccess' in result) return result;
  if ('success' in result) {
    return { isSuccess: result.success, result: result.data, error: result.error };
  }
  return { isSuccess: false, error: 'Unknown result format' };
}
```

### 2. Apply to Components
For each SharePoint service call:

**Before:**
```typescript
const result = await ContosoServiceName.getAll(options);
```

**After:**
```typescript
import { fixPowerAppsResult } from '../../utils/powerAppsResultFix'; // TODO: Remove when bug fixed

const rawResult = await ContosoServiceName.getAll(options);
const result = fixPowerAppsResult(rawResult); // TODO: Remove when bug fixed
```

Keep all existing `result.isSuccess` and `result.result` logic unchanged.

## Removal (when bug fixed)
1. Delete `src/utils/powerAppsResultFix.ts`
2. Search/replace: Remove import lines with `// TODO: Remove when bug fixed`
3. Search/replace: `const result = fixPowerAppsResult(rawResult);` → `const result = rawResult;`
