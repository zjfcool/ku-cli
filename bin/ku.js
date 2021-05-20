#! /usr/bin/env node
import program from 'commander'
import chalk from 'chalk'
import create from '../lib/create.js'
import config from '../lib/config.js'
import { packageJson } from '../utils/common.js'


// 1. 创建项目
program.command('create <project-name>')
    .description('create a new project')
    .option('-f,--force', 'overwrite target directory if it exists')
    .action((pn, cmd) => {
        create(pn, cmd);
    })
// 2. 设置配置文件
program.command('config [value]')
    .description('inspect and modify config')
    .option('-g,--get <path>', 'get value from option')
    .option('-s,--set <path> <value>', 'set config')
    .option('-d,--delete <path>', 'delete value from option')
    .option('-a,--all [value]', 'get all config')
    .action((v, cmd) => {
        config(v, cmd)
    })
// 3. 开启UI界面
program.command('ui')
    .description(`start and open ${packageJson.name} ui`)
    .option('-p,--port <value>', 'set a port')
    .action((cmd) => {
        console.log(cmd)
    })

program.usage('<command> [option]')
    .version(packageJson.version)

program.on('--help', () => {
    console.log()
    console.log(`Run ${chalk.cyan('ku <command> --help')} for detailed usage of given command.`)
    console.log()
})

program.parse(process.argv)