#!/usr/bin/env node
const { Command } = require('commander');
const chalk = require('chalk');
const boxen = require('boxen').default || require('boxen');
const readline = require('readline');
const program = new Command();
const STATE = {
    version: '1.0.0',
    model: 'ForgeEngine-Ultra',
    mode: 'Coding',
    mcpCount: 4,
    user: 'Developer',
    credits: 1000
};
function displayStartupScreen() {
    const infoText = [
        `${chalk.blue('Model:')} ${STATE.model}`,
        `${chalk.blue('Mode :')} ${STATE.mode}`,
        `${chalk.blue('MCP  :')} ${STATE.mcpCount} Connected`,
        `${chalk.green('Ready ?')}`
    ].join('\n');
    console.log(boxen(infoText, {
        title: 'CodeForge AI v1.0',
        titleAlignment: 'center',
        borderStyle: 'double',
        padding: 1,
        borderColor: 'magenta'
    }));
}
function startREPL() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.cyan('codeforge> ')
    });
    rl.prompt();
    rl.on('line', async (line) => {
        const input = line.trim();
        if (input.startsWith('/')) {
            await handleCommand(input, rl);
        }
        else if (input.length > 0) {
            console.log(chalk.gray(`Processing prompt: "${input}"...`));
        }
        rl.prompt();
    }).on('close', () => {
        console.log(chalk.yellow('\nExiting CodeForge AI. Goodbye!'));
        process.exit(0);
    });
}
async function handleCommand(command, rl) {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();
    switch (cmd) {
        case '/help':
            console.log(chalk.cyan('\nAvailable Commands:'));
            console.log('  /status   - View session dashboard');
            console.log('  /credits  - View remaining balance');
            console.log('  /admin    - Access admin features');
            console.log('  /exit     - Close the application\n');
            break;
        case '/credits':
            console.log(`\n${chalk.bold('--- Credit Status ---')}`);
            console.log(`User: ${STATE.user}`);
            console.log(`Remaining Credits: ${chalk.green(STATE.credits)}`);
            console.log(`Active Model: ${STATE.model}\n`);
            break;
        case '/status':
            console.log(`\nWorkspace: ${process.cwd()}`);
            console.log(`Active Model: ${STATE.model}`);
            console.log(`Connected MCP Servers: ${STATE.mcpCount}\n`);
            break;
        case '/admin':
            console.log(chalk.red('\n[Error] Admin Mode requires secure token authentication.'));
            console.log(chalk.gray('Configure ADMIN_TOKEN in your local .env file first.\n'));
            break;
        case '/exit':
            rl.close();
            break;
        default:
            console.log(chalk.red(`Unknown command: ${cmd}. Type /help for options.`));
    }
}
program
    .name('codeforge')
    .description('CodeForge AI Terminal Interface')
    .version(STATE.version)
    .action(() => {
    displayStartupScreen();
    startREPL();
});
program.parse(process.argv);
export {};
//# sourceMappingURL=index.js.map