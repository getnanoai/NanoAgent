import * as vscode from 'vscode';
import { LogService } from './services/LogService';
import { NanoAgentProcessManager } from './services/NanoAgentProcessManager';
import { registerCommands } from './commands';
import { SessionManager } from './services/SessionManager';
import { registerChatCommands } from './commands/chat';
import { ChatViewProvider } from './webviews/ChatViewProvider';

let processManager: NanoAgentProcessManager;
let sessionManager: SessionManager;

export function activate(context: vscode.ExtensionContext) {
    const logService = LogService.getInstance();
    logService.info(`NanoAgent extension activated (v${context.extension.packageJSON.version}).`);

    processManager = new NanoAgentProcessManager(context.globalState);
    sessionManager = new SessionManager(processManager, context.secrets);
    const chatViewProvider = new ChatViewProvider(sessionManager, context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            ChatViewProvider.viewType,
            chatViewProvider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        )
    );

    registerCommands(context, processManager, logService);
    registerChatCommands(context, sessionManager, chatViewProvider);

    // Status bar item for instant visibility & 1-click access
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.command = 'nanoagent.openChat';
    statusBarItem.text = 'N NanoAgent';
    statusBarItem.tooltip = 'Open NanoAgent Chat (Ctrl+Alt+A)';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Check autoStart config
    const config = vscode.workspace.getConfiguration('nanoagent');
    if (config.get<boolean>('autoStart', false)) {
        processManager.start();
    }

    // Auto-open chat on first launch if enabled
    const autoOpen = config.get<boolean>('autoOpenChat', true);
    const HAS_AUTO_OPENED_KEY = 'nanoagent.hasAutoOpenedChat';
    if (autoOpen && !context.globalState.get<boolean>(HAS_AUTO_OPENED_KEY, false)) {
        void context.globalState.update(HAS_AUTO_OPENED_KEY, true);
        setTimeout(() => {
            void vscode.commands.executeCommand('nanoagent.openChat');
        }, 300);
    }

    context.subscriptions.push({
        dispose: () => {
            processManager.stop();
            logService.dispose();
        }
    });
}

export function deactivate() {
    if (processManager) {
        return processManager.stop();
    }
}
