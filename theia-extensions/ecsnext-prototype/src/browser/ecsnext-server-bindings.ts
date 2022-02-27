import { interfaces } from '@theia/core/shared/inversify';
import { PreferenceService, createPreferenceProxy, PreferenceContribution } from '@theia/core/lib/browser';
import { ECSNextPreferences, ServerSchema } from './ecsnext-server-preference';

export function bindECSNextServerPreferences(bind: interfaces.Bind): void {
  bind(ECSNextPreferences)
    .toDynamicValue((ctx) => {
      const preferences = ctx.container.get<PreferenceService>(PreferenceService);
      return createPreferenceProxy(preferences, ServerSchema);
    })
    .inSingletonScope();
  bind(PreferenceContribution).toConstantValue({
    schema: ServerSchema,
  });
}
