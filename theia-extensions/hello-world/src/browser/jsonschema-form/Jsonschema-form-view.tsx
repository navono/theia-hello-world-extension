import * as React from '@theia/core/shared/react';

export interface Greeting {
  name: string;
  at: string;
}

export class GreetingView extends React.Component<Greeting> {
  render(): JSX.Element {
    return (
      <h1>
        Hello {this.props.name} at {this.props.at}!
      </h1>
    );
  }
}

export class JsonschemaFormView extends React.Component<any, Greeting> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: 'World',
      at: 'Theia Workshop',
    };
  }

  render(): JSX.Element {
    // TODO: render a place of greeting:
    // - Add a new property `at` to `Greeting` of `string` type to define a place of greeting state.
    // - Initialize the default place of greeting as `Theia Workshop` in the constructor.
    // - Add a new property `updateAt` to update the place of greeting state. It should be implemented after `updateName` property.
    // - Render another input field for the place of greeting after the input field for name. Separate them by ` at ` string.
    return (
      <React.Fragment>
        <GreetingView name={this.state.name} at={this.state.at} />
        Greet <input value={this.state.name} onChange={this.updateName} /> at{' '}
        <input value={this.state.at} onChange={this.updateAt} />
      </React.Fragment>
    );
  }

  protected updateName = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({
      name: e.currentTarget.value,
    });

  protected updateAt = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({
      at: e.currentTarget.value,
    });
}
