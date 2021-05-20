import fs from 'fs'
import path from 'path'

const hasYarnProject = (cwd = process.cwd()) => fs.existsSync(path.resolve(cwd, 'yarn.lock'))

export {
    hasYarnProject
}