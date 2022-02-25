import { ContainerModule } from '@theia/core/shared/inversify';
import { EcsnextPrototypeWidget } from './ecsnext-prototype-widget';
import { EcsnextPrototypeContribution } from './ecsnext-prototype-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, EcsnextPrototypeContribution);
    bind(FrontendApplicationContribution).toService(EcsnextPrototypeContribution);
    bind(EcsnextPrototypeWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: EcsnextPrototypeWidget.ID,
        createWidget: () => ctx.container.get<EcsnextPrototypeWidget>(EcsnextPrototypeWidget)
    })).inSingletonScope();
});
