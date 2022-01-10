import { MaybePromise } from '@theia/core';
import { injectable } from '@theia/core/shared/inversify';
import { PropertyViewContentWidget } from '@theia/property-view/lib/browser/property-view-content-widget';
// import { PropertyViewWidgetProvider } from '@theia/property-view/lib/browser/property-view-widget-provider';
import { DefaultPropertyViewWidgetProvider } from '@theia/property-view/lib/browser/property-view-widget-provider';

@injectable()
export class FamilyViewWidgetProvider extends DefaultPropertyViewWidgetProvider {
  @inject(ResourcePropertyViewTreeWidget) protected treeWidget: ResourcePropertyViewTreeWidget;

  canHandle(selection: Object | undefined): MaybePromise<number> {
    throw new Error('Method not implemented.');
  }

  provideWidget(selection: Object | undefined): Promise<PropertyViewContentWidget> {
    throw new Error('Method not implemented.');
  }

  updateContentWidget(selection: Object | undefined): void {
    throw new Error('Method not implemented.');
  }
}
