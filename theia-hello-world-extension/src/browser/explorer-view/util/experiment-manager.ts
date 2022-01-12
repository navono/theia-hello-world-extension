// import { Trace } from 'tsp-typescript-client/lib/models/trace';
// import { TspClient } from 'tsp-typescript-client/lib/protocol/tsp-client';
// import { Query } from 'tsp-typescript-client/lib/models/query/query';
// import { OutputDescriptor } from 'tsp-typescript-client/lib/models/output-descriptor';
// import { any } from 'tsp-typescript-client/lib/models/experiment';
// import { TraceManager } from './trace-manager';
// import { TspClientResponse } from 'tsp-typescript-client/lib/protocol/tsp-client-response';
import { signalManager, Signals } from './signal-manager';
import { Experiment } from '../util/experiment';

export class ExperimentManager {
  //   private fOpenExperiments: Map<string, any> = new Map();

  private _experiment: Experiment | undefined;

  //   private fTspClient: TspClient;

  //   private fTraceManager: TraceManager;

  constructor() {
    // this.fTspClient = tspClient;
    // this.fTraceManager = traceManager;
    signalManager().on(Signals.EXPERIMENT_DELETED, (experiment: any) => this.onExperimentDeleted(experiment));
  }

  /**
   * Get an array of opened experiments
   * @returns Array of experiment
   */
  async getOpenedExperiments(): Promise<Experiment[]> {
    // const openedExperiments: Array<any> = [];
    // // Look on the server for opened experiments
    // const experimentsResponse = await this.fTspClient.fetchExperiments();
    // const experiments = experimentsResponse.getModel();
    // if (experimentsResponse.isOk() && experiments) {
    //   openedExperiments.push(...experiments);
    // }

    if (!this._experiment) {
      this._experiment = {
        name: 'experiment',
        UUID: '1',
      };
    }

    return [this._experiment];
  }

  /**
   * Get a specific experiment information
   * @param experimentUUID experiment UUID
   */
  async getExperiment(experimentUUID: string): Promise<Experiment | undefined> {
    // // Check if the experiment is in "cache"
    // let experiment = this.fOpenExperiments.get(experimentUUID);

    // // If the experiment is undefined, check on the server
    // if (!experiment) {
    //   const experimentResponse = await this.fTspClient.fetchExperiment(experimentUUID);
    //   if (experimentResponse.isOk()) {
    //     experiment = experimentResponse.getModel();
    //   }
    // }

    if (this._experiment && this._experiment.UUID === experimentUUID) {
      return this._experiment;
    }

    return undefined;
  }

  /**
   * Get an array of OutputDescriptor for a given experiment
   * @param experimentUUID experiment UUID
   */
  async getAvailableOutputs(experimentUUID: string): Promise<any[] | undefined> {
    console.log('getAvailableOutputs', experimentUUID);

    // const outputsResponse = await this.fTspClient.experimentOutputs(experimentUUID);
    // if (outputsResponse && outputsResponse.getStatusCode() === 200) {
    //   return outputsResponse.getModel();
    // }
    return undefined;
  }

  /**
   * Open a given experiment on the server
   * @param experimentURI experiment URI to open
   * @param experimentName Optional name for the experiment. If not specified the URI name is used
   * @returns The opened experiment
   */
  async openExperiment(experimentName: string): Promise<Experiment | undefined> {
    const name = experimentName;

    // const traceURIs = new Array<string>();
    // for (let i = 0; i < traces.length; i++) {
    //   traceURIs.push(traces[i].UUID);
    // }

    // const tryCreate = async function (tspClient: TspClient, retry: number): Promise<TspClientResponse<any>> {
    //   return tspClient.createExperiment(
    //     new Query({
    //       name: retry === 0 ? name : name + '(' + retry + ')',
    //       traces: traceURIs,
    //     })
    //   );
    // };
    // let tryNb = 0;
    // let experimentResponse: TspClientResponse<any> | undefined;
    // while (experimentResponse === undefined || experimentResponse.getStatusCode() === 409) {
    //   experimentResponse = await tryCreate(this.fTspClient, tryNb);
    //   tryNb++;
    // }
    // const experiment = experimentResponse.getModel();
    // if (experimentResponse.isOk() && experiment) {
    //   this.addExperiment(experiment);
    //   signalManager().fireExperimentOpenedSignal(experiment);
    //   return experiment;
    // }
    // // TODO Handle any other experiment open errors
    // return undefined;

    this._experiment = {
      name,
      UUID: '1',
    };

    signalManager().fireExperimentOpenedSignal(this._experiment);
    return this._experiment;
  }

  /**
   * Update the experiment with the latest info from the server.
   * @param experimentUUID experiment UUID
   * @returns The updated experiment or undefined if the experiment failed to update
   */
  async updateExperiment(experimentUUID: string): Promise<any | undefined> {
    // const experimentResponse = await this.fTspClient.fetchExperiment(experimentUUID);
    // const experiment = experimentResponse.getModel();
    // if (experiment && experimentResponse.isOk) {
    //   this.fOpenExperiments.set(experimentUUID, experiment);
    //   return experiment;
    // }

    console.log('updateExperiment', experimentUUID);
    return undefined;
  }

  /**
   * Delete the given experiment from the server
   * @param experimentUUID experiment UUID
   */
  //   async deleteExperiment(experimentUUID: string): Promise<void> {
  //     // const experimentToDelete = this.fOpenExperiments.get(experimentUUID);
  //     // if (experimentToDelete) {
  //     //   await this.fTspClient.deleteExperiment(experimentUUID);
  //     //   const deletedExperiment = this.removeExperiment(experimentUUID);
  //     //   if (deletedExperiment) {
  //     //     signalManager().fireExperimentDeletedSignal(deletedExperiment);
  //     //   }
  //     // }
  //   }

  private onExperimentDeleted(experiment: Experiment) {
    /*
     * TODO: Do not close traces used by another experiment
     */
    // Close each trace
    // const traces = experiment.traces;
    // for (let i = 0; i < traces.length; i++) {
    //   this.fTraceManager.deleteTrace(traces[i].UUID);
    // }

    if (this._experiment?.UUID === experiment.UUID) {
      this._experiment = undefined;
    }
  }

  public addExperiment(experiment: Experiment): void {
    // this.fOpenExperiments.set(experiment.UUID, experiment);
    // experiment.traces.forEach((trace) => {
    //   this.fTraceManager.addTrace(trace);
    // });

    if (!this._experiment) {
      this._experiment = experiment;
    }
  }

  private removeExperiment(): any | undefined {
    // const deletedExperiment = this.fOpenExperiments.get(experimentUUID);
    // this.fOpenExperiments.delete(experimentUUID);
    // return deletedExperiment;
  }
}

const instance: ExperimentManager = new ExperimentManager();

export const experimentManager = (): ExperimentManager => instance;
