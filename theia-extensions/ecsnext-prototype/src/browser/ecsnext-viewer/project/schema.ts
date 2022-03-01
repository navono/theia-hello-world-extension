import { UiSchema } from '@rjsf/core';
import type { JSONSchema7 } from 'json-schema';

const schema: JSONSchema7 = {
  // title: 'Maximum call stack',
  // description: 'Example to reproduce the error.',
  $ref: '#/definitions/User',
  type: 'object',
  required: ['username', 'password'],
  definitions: {
    User: {
      properties: {
        username: {
          type: 'string',
          title: 'User name',
        },
        password: {
          type: 'string',
          title: 'Password',
        },
      },
    },
  },
};

const uiSchema: UiSchema = {
  password: {
    'ui:widget': 'password',
  },
};

export default {
  schema: schema,
  uiSchema: uiSchema,
  formData: {},
};
