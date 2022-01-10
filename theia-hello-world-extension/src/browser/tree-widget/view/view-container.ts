// import { createTreeContainer, LabelProviderContribution, TreeProps, TreeWidget } from '@theia/core/lib/browser';
import { LabelProviderContribution } from '@theia/core/lib/browser';
import { interfaces } from '@theia/core/shared/inversify';
import { PropertyDataService } from '@theia/property-view/lib/browser/property-data-service';
// import { PropertyViewWidgetProvider } from '@theia/property-view/lib/browser/property-view-widget-provider';

import { FamilyViewLabelProvider } from './label-provider';
import { FamilyViewDataService } from './data-service';

// const createResourcePropertyViewTreeWidget = ()

export const bindFamilyView = (bind: interfaces.Bind): void => {
  bind(LabelProviderContribution).to(FamilyViewLabelProvider).inSingletonScope();
  bind(PropertyDataService).to(FamilyViewDataService).inSingletonScope();
  // bind(PropertyViewWidgetProvider).to(ResourcePropertyViewWidgetProvider).inSingletonScope();
};
