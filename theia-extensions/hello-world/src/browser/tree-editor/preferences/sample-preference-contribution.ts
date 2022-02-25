import { PreferenceContribution, PreferenceSchema } from '@theia/core/lib/browser';
import { interfaces } from 'inversify';

export const samplePreferenceSchema: PreferenceSchema = {
  type: 'object',
  properties: {
    'sample.spaces': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          'sample.settings.space.default': {
            type: 'boolean',
            description: 'Default space to connect to',
            default: false,
          },
          'sample.settings.space.domain': {
            type: 'string',
            description: 'Url for sample space',
          },
          'sample.settings.space.username': {
            type: 'string',
            description: 'Username for sample space',
          },
          'sample.settings.space.password': {
            type: 'string',
            description: 'Password for username',
          },
        },
      },
      default: [],
      description: 'Sample Settings',
    },
  },
};

export function bindSamplePreferences(bind: interfaces.Bind): void {
  bind(PreferenceContribution).toConstantValue({
    schema: samplePreferenceSchema,
  });
}
