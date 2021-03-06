import { fetchRepos, fetchTags } from '../api/index.js'
import inquirer from 'inquirer'
import { wrapLoading, configStore } from '../utils/common.js'
import { promisify } from 'util'
import downloadRepo from 'download-git-repo'
import ejs from 'ejs'
import fs from 'fs-extra'
import path from 'path'
import spawn from 'cross-spawn'
import chalk from 'chalk'
import { hasYarnProject, hasYarn } from '../utils/env.js'

const downloadGitRepo = promisify(downloadRepo)



class Creator {
    constructor(projectName, targetPath) {
        this.name = projectName;
        this.target = targetPath;
        this.requestUrl = null;
    }
    async create() {
        this.handleTemplateType()
    }
    async handleTemplateType() {
        const { temType } = await inquirer.prompt({
            name: "temType",
            type: 'list',
            choices: [
                { value: 'default', name: "Default" },
                { value: 'custom', name: "Custom" }
            ],
            message: "Please choose template type:"
        });
        switch (temType) {
            case 'default':
                this.requestUrl = null;
                //1. 获取项目模板名称
                const repo = await this.getRepo()
                // 2. 获取版本号
                const tag = await this.getTag(repo)
                // 3. 下载
                await this.download(repo, tag)
                break;
            case "custom":
                const { requestUrl } = await inquirer.prompt({
                    name: 'requestUrl',
                    type: 'input',
                    message: "Please input custom template url:",
                    validate: function (input) {
                        if (!input) return `Error: template url is required`
                        return true;
                    }
                })
                this.requestUrl = requestUrl;
                await this.download();
        }
    }
    _spawn() {
        const isYarnProject = hasYarnProject(this.name)
        const isYarn = hasYarn();
        spawn(isYarnProject ? isYarn ? 'yarn' : 'npx' : 'npm', isYarnProject ? isYarn ? [] : ['yarn'] : ['install'], {
            cwd: this.target,
            stdio: ['pipe', process.stdout, process.stderr]
        })
            .on('close', () => {
                console.log()
                console.log(`Successfully created project ${chalk.yellowBright(this.name)}`)
                console.log('Get started with the following commands:')
                console.log()
                console.log(chalk.cyan(`cd ${this.name}`))
                console.log(chalk.cyan(isYarnProject ? 'yarn start\r\n' : `npm run serve\r\n`))
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
        const pkgPath = path.resolve(this.target, configStore.get('pkgPath') || 'pkg.json');
        if (fs.existsSync(pkgPath)) {
            const pkg = fs.readFileSync(pkgPath).toString()
            return await inquirer.prompt(JSON.parse(pkg))
        }
    }
    async download(repo, tag) {
        const requestUrl = this.requestUrl ? this.requestUrl : `${configStore.get('organization')}/${repo}#${tag}`
        await wrapLoading(downloadGitRepo, 'wait download repo ...', requestUrl, this.target)
        // 4. 设置一些模板内容
        this.packageData = await this.setPackage();

        this.compilerProject()
        // 进入项目目录自动下载依赖
        this._spawn()
    }
    compilerProject() {
        const packagePath = path.join(this.target, 'package.json')
        if (fs.existsSync(packagePath)) {
            const content = fs.readFileSync(packagePath, 'utf8')
            const result = ejs.compile(content)(this.packageData)
            fs.writeFileSync(packagePath, result)
        }
    }

}
export default Creator;