import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const hasYarnProject = (cwd = process.cwd()) => fs.existsSync(path.resolve(cwd, 'yarn.lock'))
const hasYarn = () => {
    try {
        execSync('yarn --version', { stdio: 'ignore' })
        return true;
    } catch (err) {
        return false;
    }
}

export {
    hasYarnProject,
    hasYarn
}