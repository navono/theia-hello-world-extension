import * as express from 'express';
import { injectable } from 'inversify';
import { BackendApplicationContribution } from '@theia/core/lib/node';
import { Theia3dViewFileServerPath } from '../../common/theia-3d-view-protocol';

@injectable()
export class Theia3dViewFileServer implements BackendApplicationContribution {
  configure(app: express.Application) {
    app.use('/test/ping/', (req, res) => {
      res.end('ok');
    });
    app.get(`${Theia3dViewFileServerPath}/:path`, (request, response) => {
      console.error('3d viwer');
      response.sendFile(request.params.path);
    });
  }
}
