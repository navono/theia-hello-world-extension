import { ContainerModule } from '@theia/core/shared/inversify';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';
import { FileNavigatorContribution as TheiaFileNavigatorContribution } from '@theia/navigator/lib/browser/navigator-contribution';
import { ScmContribution as TheiaScmContribution } from '@theia/scm/lib/browser/scm-contribution';

import { FileNavigatorContribution } from './theia/navigator/navigator-contribution';
import { ScmContribution } from './theia/scm/scm-contribution';

import { EcsnextPrototypeWidget } from './ecsnext-prototype-widget';
import { EcsnextPrototypeContribution } from './ecsnext-prototype-contribution';

import '../../src/browser/style/index.css';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
    bindViewContribution(bind, EcsnextPrototypeContribution);
    bind(FrontendApplicationContribution).toService(EcsnextPrototypeContribution);
    bind(EcsnextPrototypeWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: EcsnextPrototypeWidget.ID,
        createWidget: () => ctx.container.get<EcsnextPrototypeWidget>(EcsnextPrototypeWidget)
    })).inSingletonScope();

    rebind(TheiaFileNavigatorContribution).to(FileNavigatorContribution).inSingletonScope();
    rebind(TheiaScmContribution).to(ScmContribution).inSingletonScope();
});
