import { fetchRepos, fetchTags } from '../api/index.js'
import inquirer from 'inquirer'
import { wrapLoading } from '../utils/common.js'
import { promisify } from 'util'
import downloadRepo from 'download-git-repo'
import ejs from 'ejs'
import fs from 'fs-extra'
import path from 'path'
import spawn from 'cross-spawn'
import chalk from 'chalk'


const downloadGitRepo = promisify(downloadRepo)



class Creator {
    constructor(projectName, targetPath) {
        this.name = projectName;
        this.target = targetPath;
    }
    async create() {
        //1. 获取项目模板名称
        const repo = await this.getRepo()
        // 2. 获取版本号
        const tag = await this.getTag(repo)
        // 3. 下载
        await this.download(repo, tag)


    }
    _spawn() {
        spawn('npm', ['install'], {
            cwd: this.target,
            stdio: ['pipe', process.stdout, process.stderr]
        })
            .on('close', () => {
                console.log()
                console.log(`Successfully created project ${chalk.yellowBright(this.name)}`)
                console.log('Get started with the following commands:')
                console.log()
                console.log(chalk.cyan(`cd ${this.name}`))
                console.log(chalk.cyan(`npm run serve\r\n`))
            })
    }
    async getRepo() {
        let repos = await wrapLoading(fetchRepos, 'wait fetch repo ...')
        if (!repos) return;
        repos = repos.map(repo => repo.name)
        const { repo } = await inquirer.prompt({
            name: "repo",
            type: "list",
            choices: repos,
            message: 'please choose a project template'
        })
        return repo
    }
    async getTag(repo) {
        let tags = await wrapLoading(fetchTags, 'wait fetch tag...', repo)
        if (!tags) return;
        tags = tags.map(repo => repo.name)
        const { tag } = await inquirer.prompt({
            name: "tag",
            type: "list",
            choices: tags,
            message: 'please choose a tag'
        })
        return tag
    }
    async setPackage() {
        const askPath = path.resolve(this.target, 'ask.json');
        console.log('====', askPath)
        if (fs.existsSync(askPath)) {
            const ask = fs.readFileSync(askPath).toString()
            return await inquirer.prompt(JSON.parse(ask))
        }
        // const result = await inquirer.prompt([
        //     {
        //         name: "private",
        //         type: "confirm",
        //         default: 'n',
        //         message: "Is this project privated?"
        //     },
        //     {
        //         name: "author",
        //         default: "",
        //         message: "What is the author?"
        //     },
        //     {
        //         name: "description",
        //         default: "a project",
        //         message: 'What is the project description?'
        //     }
        // ])
        // return result;
    }
    async download(repo, tag) {
        const requestUrl = `zhu-cli/${repo}#${tag}`
        await wrapLoading(downloadGitRepo, 'wait download repo ...', requestUrl, this.target)
        // 4. 设置一些模板内容
        this.packageData = await this.setPackage();

        this.compilerProject()
        // 进入项目目录自动下载依赖
        this._spawn()
    }
    compilerProject() {
        const packagePath = path.join(this.target, 'package.json')
        console.log(packagePath)
        if (fs.existsSync(packagePath)) {
            const content = fs.readFileSync(packagePath).toString()
            const result = ejs.compile(content)(this.packageData)
            fs.writeFileSync(packagePath, result)
        }
    }

}

// module.exports = Creator;
export default Creator;