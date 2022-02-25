/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from '@theia/core/shared/inversify';
import { ResourceResolver, Resource, ResourceProvider, DisposableCollection, Emitter, Event } from '@theia/core';
import URI from '@theia/core/lib/common/uri';
import { MonacoWorkspace } from '@theia/monaco/lib/browser/monaco-workspace';

import hljs = require('highlight.js');
import MarkdownIt = require('markdown-it');
import { MarkdownUri } from './markdown-uri';

export class MarkdownResource implements Resource {
  protected readonly originalUri: string;

  protected readonly toDispose = new DisposableCollection();

  protected readonly onDidChangeContentsEmitter = new Emitter<void>();

  constructor(
    public readonly uri: URI,
    protected readonly originalResource: Resource,
    protected readonly workspace: MonacoWorkspace,
    protected readonly engine: MarkdownIt
  ) {
    this.originalUri = this.originalResource.uri.toString();
    this.toDispose.push(originalResource);
    this.toDispose.push(this.onDidChangeContentsEmitter);
    if (originalResource.onDidChangeContents) {
      this.toDispose.push(originalResource.onDidChangeContents(() => this.fireDidChangeContents()));
    }
    this.toDispose.push(this.workspace.onDidOpenTextDocument((document) => this.fireDidChangeContents(document.uri)));
    this.toDispose.push(
      this.workspace.onDidChangeTextDocument((params) => this.fireDidChangeContents(params.model.uri))
    );
    this.toDispose.push(this.workspace.onDidCloseTextDocument((document) => this.fireDidChangeContents(document.uri)));
  }

  dispose(): void {
    this.toDispose.dispose();
  }

  get onDidChangeContents(): Event<void> {
    return this.onDidChangeContentsEmitter.event;
  }

  protected fireDidChangeContents(affectedUri?: string): void {
    if (this.shouldFireDidChangeContents(affectedUri)) {
      this.onDidChangeContentsEmitter.fire(undefined);
    }
  }

  protected shouldFireDidChangeContents(affectedUri?: string): boolean {
    return !affectedUri || affectedUri === this.originalUri;
  }

  async readContents(options?: { encoding?: string | undefined }): Promise<string> {
    const document = this.workspace.textDocuments.find((v) => v.uri === this.originalUri);
    if (document) {
      return this.render(document.getText());
    }
    return this.render(await this.originalResource.readContents(options));
  }

  protected render(text: string): string {
    return this.engine.render(text);
  }
}

@injectable()
export class MarkdownResourceResolver implements ResourceResolver {
  //   @inject(FileService)
  // protected readonly fileService: FileService;

  @inject(MarkdownUri)
  protected readonly markdownUri: MarkdownUri;

  @inject(MonacoWorkspace)
  protected readonly workspace: MonacoWorkspace;

  @inject(ResourceProvider)
  protected readonly resourceProvider: ResourceProvider;

  async resolve(uri: URI): Promise<MarkdownResource> {
    const resourceUri = this.markdownUri.from(uri);
    const originalResource = await this.resourceProvider(resourceUri);
    return new MarkdownResource(uri, originalResource, this.workspace, this.getEngine());
  }

  protected engine: MarkdownIt | undefined;

  protected getEngine(): MarkdownIt {
    if (!this.engine) {
      this.engine = MarkdownIt({
        html: true,
        linkify: true,
        highlight: (str, lang) => {
          if (lang && hljs.default.getLanguage(lang)) {
            try {
              return `<pre class="hljs"><code>${hljs.default.highlight(lang, str, true).value}</code></pre>`;
              // eslint-disable-next-line no-empty
            } catch {}
          }

          return `<pre class="hljs"><code>${this.engine!.utils.escapeHtml(str)}</code></pre>`;
        },
      });
    }
    return this.engine;
  }
}
