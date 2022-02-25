/* eslint-disable @typescript-eslint/ban-types */
import { Navigatable } from '@theia/core/lib/browser';
// import URI from '@theia/core/lib/common/uri';
import { PropertyDataService } from '@theia/property-view/lib/browser/property-data-service';
import { MemberNode } from '../tree/family-tree';

export class FamilyViewDataService implements PropertyDataService {
  readonly id = 'familyView';

  readonly label = 'FamilyView';

  canHandleSelection(selection: Object | undefined): number {
    console.log('Family view canHandleSelection', selection);

    return this.isNavigatableSelection(selection) ? 1 : 0;
  }

  async providePropertyData(selection: Object | undefined): Promise<any | undefined> {
    return this.getFamilyData(selection as MemberNode);
  }

  protected async getFamilyData(selection: MemberNode): Promise<MemberNode> {
    return Promise.resolve(selection);
  }

  protected isNavigatableSelection(selection: Object | undefined): boolean {
    return !!selection && Navigatable.is(selection);
  }
}
