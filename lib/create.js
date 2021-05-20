import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import Creator from './Creator.js'
export default async (projectName, options) => {
    const cwd = process.cwd();
    const targetPath = path.join(cwd, projectName)
    if (fs.existsSync(targetPath)) {
        if (options.force) {
            await fs.remove(targetPath)
        } else {
            const { action } = await inquirer.prompt([
                {
                    name: "action",
                    type: 'list',
                    message: 'Target directory already exists,please choose an action:',
                    choices: [
                        {
                            name: "Overwrite",
                            value: 'overwrite'
                        },
                        {
                            name: "Cancel",
                            value: false
                        }
                    ]
                }
            ])
            if (!action) return;
            else {
                console.log('\r\nRemoving ...')
                await fs.remove(targetPath)
            }
        }
    }
    const creator = new Creator(projectName, targetPath)
    creator.create()
}