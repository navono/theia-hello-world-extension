import { injectable, inject, postConstruct } from 'inversify';
import * as React from 'react';
import { ApplicationShell, Widget } from '@theia/core/lib/browser';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { CommandContribution, CommandRegistry, DisposableCollection, Emitter, MenuModelRegistry } from '@theia/core';
import { TraceViewerToolbarCommands, TraceViewerToolbarMenus } from './viewer-toolbar-commands';
// import { signalManager, Signals } from 'traceviewer-base/lib/signals/signal-manager';
import { ViewerWidget } from './viewer-widget';
// import { TspClientProvider } from '../tsp-client-provider-impl';
import { ContextMenuRenderer } from '@theia/core/lib/browser';
import { ExplorerOpenedTracesWidget } from '../explorer/trace-explorer-sub-widgets/explorer-opened-traces-widget';
import { OpenTraceCommand } from './viewer-commands';

@injectable()
export class ViewerToolbarContribution implements TabBarToolbarContribution, CommandContribution {
  @inject(ApplicationShell) protected readonly shell: ApplicationShell;

  @inject(ContextMenuRenderer) protected readonly contextMenuRenderer!: ContextMenuRenderer;

  // @inject(TspClientProvider) protected readonly tspClientProvider!: TspClientProvider;

  @inject(MenuModelRegistry)
  protected readonly menus: MenuModelRegistry;

  @inject(CommandRegistry)
  protected readonly commands: CommandRegistry;

  // private onMarkerCategoriesFetchedSignal = () => this.doHandleMarkerCategoriesFetchedSignal();

  // private onMarkerSetsFetchedSignal = () => this.doHandleMarkerSetsFetchedSignal();

  protected readonly onMarkerCategoriesChangedEmitter = new Emitter<void>();

  protected readonly onMarkerCategoriesChangedEvent = this.onMarkerCategoriesChangedEmitter.event;

  protected readonly onMakerSetsChangedEmitter = new Emitter<void>();

  protected readonly onMakerSetsChangedEvent = this.onMakerSetsChangedEmitter.event;

  @postConstruct()
  protected init(): void {
    // signalManager().on(Signals.MARKER_CATEGORIES_FETCHED, this.onMarkerCategoriesFetchedSignal);
    // signalManager().on(Signals.MARKERSETS_FETCHED, this.onMarkerSetsFetchedSignal);
  }

  // private doHandleMarkerCategoriesFetchedSignal() {
  //   this.onMarkerCategoriesChangedEmitter.fire();
  // }

  // private doHandleMarkerSetsFetchedSignal() {
  //   this.onMakerSetsChangedEmitter.fire();
  // }

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(TraceViewerToolbarCommands.ZOOM_IN, {
      isVisible: (w: Widget) => {
        if (w instanceof ViewerWidget) {
          const traceWidget = w as ViewerWidget;
          // return traceWidget.isTimeRelatedChartOpened();

          console.error('ZOOM_IN visible', traceWidget);
          return true;
        }
        return false;
      },
      execute: () => {
        console.error('ZOOM_IN');

        // signalManager().fireUpdateZoomSignal(true);
      },
    });
    registry.registerCommand(TraceViewerToolbarCommands.ZOOM_OUT, {
      isVisible: (w: Widget) => {
        if (w instanceof ViewerWidget) {
          const traceWidget = w as ViewerWidget;
          // return traceWidget.isTimeRelatedChartOpened();
          console.error('ZOOM_OUT visible', traceWidget);
          return true;
        }
        return false;
      },
      execute: () => {
        console.error('ZOOM_OUT');

        // signalManager().fireUpdateZoomSignal(false);
      },
    });
    registry.registerCommand(TraceViewerToolbarCommands.RESET, {
      isVisible: (w: Widget) => {
        if (w instanceof ViewerWidget) {
          const traceWidget = w as ViewerWidget;
          // return traceWidget.isTimeRelatedChartOpened();

          console.error('RESET visible', traceWidget);
          return true;
        }
        return false;
      },
      execute: () => {
        console.error('RESET');

        // signalManager().fireResetZoomSignal();
      },
    });
    registry.registerCommand(TraceViewerToolbarCommands.OPEN_TRACE, {
      isVisible: (w: Widget) => {
        if (w instanceof ExplorerOpenedTracesWidget) {
          return true;
        }
        return false;
      },
      execute: async () => {
        await registry.executeCommand(OpenTraceCommand.id);
      },
    });
  }

  registerToolbarItems(registry: TabBarToolbarRegistry): void {
    registry.registerItem({
      id: TraceViewerToolbarCommands.ZOOM_IN.id,
      command: TraceViewerToolbarCommands.ZOOM_IN.id,
      tooltip: TraceViewerToolbarCommands.ZOOM_IN.label,
      priority: 1,
    });
    registry.registerItem({
      id: TraceViewerToolbarCommands.ZOOM_OUT.id,
      command: TraceViewerToolbarCommands.ZOOM_OUT.id,
      tooltip: TraceViewerToolbarCommands.ZOOM_OUT.label,
      priority: 2,
    });
    registry.registerItem({
      id: TraceViewerToolbarCommands.RESET.id,
      command: TraceViewerToolbarCommands.RESET.id,
      tooltip: TraceViewerToolbarCommands.RESET.label,
      priority: 3,
    });
    registry.registerItem({
      id: TraceViewerToolbarCommands.FILTER.id,
      isVisible: (w) => {
        if (w instanceof ViewerWidget) {
          const traceViewerWidget = w as ViewerWidget;
          // const markerCategories = traceViewerWidget.getMarkerCategories();
          // return markerCategories.size > 0;

          console.error('FILTER visible', traceViewerWidget);
          return true;
        }
        return false;
      },
      // render() here is not a react component and hence need to disable the react display-name rule
      // eslint-disable-next-line react/display-name
      render: (widget: Widget) => (
        <div className="item enabled">
          <div
            id="trace.viewer.toolbar.filter"
            className="fa fa-filter"
            title="Markers filter"
            onClick={async (event: React.MouseEvent) => {
              const toDisposeOnHide = new DisposableCollection();
              const menuPath = TraceViewerToolbarMenus.MARKER_CATEGORIES_MENU;
              // let index = 0;
              // const traceViewerWidget = widget as ViewerWidget;
              // const markerCategories = traceViewerWidget.getMarkerCategories();
              // markerCategories.forEach((categoryInfo, categoryName) => {
              //   const toggleInd = categoryInfo.toggleInd;
              //   index += 1;
              //   toDisposeOnHide.push(
              //     this.menus.registerMenuAction(menuPath, {
              //       label: categoryName,
              //       commandId: categoryName.toString() + index.toString(),
              //       order: index.toString(),
              //     })
              //   );
              //   toDisposeOnHide.push(
              //     this.commands.registerCommand(
              //       {
              //         id: categoryName.toString() + index.toString(),
              //         label: categoryName,
              //       },
              //       {
              //         execute: () => {
              //           traceViewerWidget.updateMarkerCategoryState(categoryName);
              //         },
              //         isToggled: () => toggleInd,
              //       }
              //     )
              //   );
              // });

              console.error('toolbar FILTER render widget', widget);

              return this.contextMenuRenderer.render({
                menuPath,
                args: [],
                anchor: { x: event.clientX, y: event.clientY },
                onHide: () => setTimeout(() => toDisposeOnHide.dispose()),
              });
            }}
          ></div>
        </div>
      ),
      priority: 4,
      group: 'navigation',
      onDidChange: this.onMarkerCategoriesChangedEvent,
    });
    registry.registerItem({
      id: TraceViewerToolbarCommands.MARKER_SETS.id,
      isVisible: (w) => {
        if (w instanceof ViewerWidget) {
          const traceViewerWidget = w as ViewerWidget;
          // return traceViewerWidget.getMarkerSets().size > 0;
          console.error('MARKER_SETS visible', traceViewerWidget);
          return true;
        }
        return false;
      },
      // render() here is not a react component and hence need to disable the react display-name rule
      // eslint-disable-next-line react/display-name
      render: (widget: ViewerWidget) => (
        <div className="item enabled">
          <div
            id="trace.viewer.toolbar.markersets"
            className="fa fa-bars"
            title="Marker Sets"
            onClick={async (event: React.MouseEvent) => {
              const toDisposeOnHide = new DisposableCollection();
              const menuPath = TraceViewerToolbarMenus.MARKER_SETS_MENU;
              // let index = 0;
              // const traceViewerWidget = widget as ViewerWidget;
              // const markerSetsMap = traceViewerWidget.getMarkerSets();
              // const sortedMarkerSets = Array.from(markerSetsMap.keys()).sort((a, b) => (a.id < b.id ? -1 : 1));
              // sortedMarkerSets.forEach((markerSet) => {
              //   index += 1;
              //   toDisposeOnHide.push(
              //     this.menus.registerMenuAction(menuPath, {
              //       label: markerSet.name,
              //       commandId: markerSet.name.toString() + index.toString(),
              //       order: String.fromCharCode(index),
              //     })
              //   );

              //   toDisposeOnHide.push(
              //     this.commands.registerCommand(
              //       {
              //         id: markerSet.name.toString() + index.toString(),
              //         label: markerSet.name,
              //       },
              //       {
              //         execute: () => {
              //           traceViewerWidget.updateMarkerSetState(markerSet);
              //         },
              //         isToggled: () => !!markerSetsMap.get(markerSet),
              //       }
              //     )
              //   );
              // });
              console.error('toolbar MARKER_SETS render widget', widget);

              return this.contextMenuRenderer.render({
                menuPath,
                args: [],
                anchor: { x: event.clientX, y: event.clientY },
                onHide: () => setTimeout(() => toDisposeOnHide.dispose()),
              });
            }}
          ></div>
        </div>
      ),
      priority: 5,
      group: 'navigation',
      onDidChange: this.onMakerSetsChangedEvent,
    });
    registry.registerItem({
      id: TraceViewerToolbarCommands.OPEN_TRACE.id,
      command: TraceViewerToolbarCommands.OPEN_TRACE.id,
      tooltip: TraceViewerToolbarCommands.OPEN_TRACE.label,
      priority: 6,
    });
  }
}
