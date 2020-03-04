import * as vscode from 'vscode';

import ConnectionController from '../connectionController';
import ExplorerTreeController from './explorerTreeController';

import { createLogger } from '../logging';

const log = createLogger('explorer controller');

export default class ExplorerController {
  private _treeController?: ExplorerTreeController;
  private _treeView?: vscode.TreeView<vscode.TreeItem>;

  activate(connectionController: ConnectionController): void {
    log.info('activate explorer controller');

    this._treeController = new ExplorerTreeController(connectionController);

    this._treeView = vscode.window.createTreeView('mongoDB', {
      treeDataProvider: this._treeController
    });

    this._treeController.activateTreeViewEventHandlers(this._treeView);
  }

  deactivate(): void {
    if (this._treeController) {
      this._treeController.removeListeners();
    }

    if (this._treeView) {
      this._treeView.dispose();
      delete this._treeView;
    }
  }

  refresh(): Promise<boolean> {
    if (this._treeController) {
      return this._treeController.refresh();
    }
    return Promise.reject(new Error('No tree to refresh.'));
  }

  // Exposed for testing.
  public getTreeView(): vscode.TreeView<vscode.TreeItem> | undefined {
    return this._treeView;
  }
  public getTreeController(): ExplorerTreeController | undefined {
    return this._treeController;
  }
}
