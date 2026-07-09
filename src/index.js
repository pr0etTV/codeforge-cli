#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import readline from 'readline';

const program = new Command();

// Vårt globala state där credits sparas
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

  console.log(
    boxen(infoText, {
      title: 'CodeForge AI v1.0',
      titleAlignment: 'center',
      borderStyle: 'double',
      padding: 1,
      borderColor: 'magenta'
    })
  );
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
    } else if (input.length > 0) {
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
      console.log('  /status      - View session dashboard');
      console.log('  /credits     - View remaining balance');
      console.log('  /admin       - Access admin features');
      console.log('  /addcredits  - [Admin] Add custom amount of credits');
      console.log('  /exit        - Close the application\n');
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
      const userToken = args[1];
      const correctToken = process.env.ADMIN_TOKEN;

      if (!correctToken) {
        console.log(chalk.red('\n[Error] No ADMIN_TOKEN found in your .env file.'));
      } else if (userToken === correctToken) {
        console.log(chalk.green('\n[Success] Access Granted to Admin Mode.'));
        console.log(chalk.yellow('System Overrides: Enabled.'));
        console.log(chalk.gray(`Developer Rights: Root\n`));
      } else {
        console.log(chalk.red('\n[Error] Access Denied. Invalid or missing token.'));
        console.log(chalk.gray('Usage: /admin <your_secret_token>\n'));
      }
      break;

    case '/addcredits':
      // Kontrollera först att vi skickat med ett nummer
      const amount = parseInt(args[1], 10);
      
      if (isNaN(amount)) {
        console.log(chalk.red('\n[Error] Ange ett giltigt antal credits.'));
        console.log(chalk.gray('Användning: /addcredits 100000\n'));
      } else {
        // Lägg till summan till vårt nuvarande state
        STATE.credits += amount;
        console.log(chalk.green(`\n[Success] Lade till ${amount} credits!`));
        console.log(`Nytt saldo: ${chalk.bold(STATE.credits)} \n`);
      }
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
