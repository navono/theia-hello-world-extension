/* eslint-disable @typescript-eslint/ban-types */
import { MaybePromise } from '@theia/core';
import { injectable, inject } from '@theia/core/shared/inversify';
import { PropertyViewContentWidget } from '@theia/property-view/lib/browser/property-view-content-widget';
import { DefaultPropertyViewWidgetProvider } from '@theia/property-view/lib/browser/property-view-widget-provider';
import { FamilyViewWidget } from './view-widget';

@injectable()
export class FamilyViewWidgetProvider extends DefaultPropertyViewWidgetProvider {
  @inject(FamilyViewWidget) protected viewWidget: FamilyViewWidget;

  // canHandle(selection: Object | undefined): MaybePromise<number> {
  canHandle(): MaybePromise<number> {
    return Promise.resolve(1);
  }

  // provideWidget(selection: Object | undefined): Promise<PropertyViewContentWidget> {
  provideWidget(): Promise<PropertyViewContentWidget> {
    return Promise.resolve(this.viewWidget);
  }

  updateContentWidget(selection: Object | undefined): void {
    this.getPropertyDataService(selection).then((service) =>
      this.viewWidget.updatePropertyViewContent(service, selection)
    );
  }
}
