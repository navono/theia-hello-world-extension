/* eslint-disable @typescript-eslint/ban-types */
import * as React from '@theia/core/shared/react';
import { ReactWidget, LabelProvider } from '@theia/core/lib/browser';
import { inject, postConstruct } from '@theia/core/shared/inversify';
import { PropertyViewContentWidget } from '@theia/property-view/lib/browser/property-view-content-widget';
import { PropertyDataService } from '@theia/property-view/lib/browser/property-data-service';
// import { MemberNode } from '../tree/family-tree';

export class FamilyViewWidget extends ReactWidget implements PropertyViewContentWidget {
  static readonly ID = 'family-view-widget';

  static readonly LABEL = 'Family View';

  protected currentSelection: unknown | undefined;

  protected emptyComponent: JSX.Element = (<div className={'theia-widget-noInfo'}>No family available.</div>);

  @inject(LabelProvider) protected readonly labelProvider: LabelProvider;

  constructor() {
    super();

    this.id = FamilyViewWidget.ID;
    this.title.label = FamilyViewWidget.LABEL;
    this.title.caption = FamilyViewWidget.LABEL;
    this.title.closable = false;
    this.node.tabIndex = 0;
  }

  @postConstruct()
  protected init(): void {
    this.id = FamilyViewWidget.ID + '-treeContainer';
    this.addClass('familyViewContainer');
  }

  protected updateNeeded(selection: Object | undefined): boolean {
    return this.currentSelection !== selection;
  }

  updatePropertyViewContent(propertyDataService?: PropertyDataService, selection?: Object | undefined): void {
    if (this.updateNeeded(selection)) {
      this.currentSelection = selection;
      if (propertyDataService) {
        propertyDataService.providePropertyData(selection).then((fileStatObject?: any) => {
          console.log('updatePropertyViewContent', fileStatObject);
          this.update();
        });
      }
    }
  }

  protected render(): React.ReactNode {
    return this.emptyComponent;
  }
}
