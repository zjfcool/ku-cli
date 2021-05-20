import ConfigStore from 'configstore'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'


function sleep(timer) {
    return new Promise(resolve => {
        const id = setTimeout(() => {
            clearTimeout(id)
            resolve()
        }, timer)
    })
}
function wrapLoading(fn, message, ...args) {
    return new Promise(async (resolve, reject) => {
        const spinner = ora(message)
        try {
            spinner.start()
            const data = await fn(...args)
            spinner.stop()
            resolve(data)
        } catch (e) {
            spinner.fail('fetch failed, refetching ...')
            await sleep(Number(configStore.get('sleep')) || 2000)
            wrapLoading(fn, message, ...args)
        }
    })

}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
function initConfig(options) {
    const ku = packageJson.name;
    const defaultOptions = {
        organization: 'aha-ku',//github 组织
    }
    return new ConfigStore(ku, Object.assign(defaultOptions, options))
}
const configStore = initConfig()

export {
    wrapLoading,
    initConfig,
    packageJson,
    configStore,
    __filename,
    __dirname
}