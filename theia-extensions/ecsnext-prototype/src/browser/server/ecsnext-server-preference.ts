import { PreferenceSchema, PreferenceProxy, PreferenceScope } from '@theia/core/lib/browser';
import { ECSNEXT_VIEWER_DEFAULT_PORT, ECSNEXT_SERVER_DEFAULT_URL } from '../../common/ecsnext-server-url-provider';

export const SERVER_IP = 'ECS Next.Server.ip';
export const SERVER_PORT = 'ECS Next.Server.port';
export const SERVER_ARGS = 'ECS Next.Server.arguments';

export const ServerSchema: PreferenceSchema = {
  scope: PreferenceScope.Folder,
  type: 'object',
  properties: {
    [SERVER_IP]: {
      type: 'string',
      default: ECSNEXT_SERVER_DEFAULT_URL,
      description: 'The path to ecsnext-server executable, e.g.: /usr/bin/tracecompass-server',
    },
    [SERVER_PORT]: {
      type: 'integer',
      default: ECSNEXT_VIEWER_DEFAULT_PORT,
      description: 'Specify the port the ECSNext would use to connect to the server',
    },
    [SERVER_ARGS]: {
      type: 'string',
      default: '',
      description:
        'Specify ecs-server command line arguments. This change will take effect the next time the server starts.' +
        '\n' +
        'E.g. for ECS Compass server: -data /home/user/server-workspace -vmargs -Dtraceserver.port=8080',
    },
  },
};

interface ECSNextPreferenceContribution {
  [SERVER_IP]?: string;
  [SERVER_PORT]: number;
  [SERVER_ARGS]: string;
}

export const ECSNextPreferences = Symbol('ECSNextPreferences');
export type ECSNextPreferences = PreferenceProxy<ECSNextPreferenceContribution>;
