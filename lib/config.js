
import chalk from 'chalk';
import { configStore } from '../utils/common.js'
import logSymbols from 'log-symbols'
let n = 0;
function formatConfig(value, key) {
    if (typeof value === 'object') {
        return Object.entries(value).map(([k, v]) => {
            n++;
            return formatConfig(v, key ? `${key}.${k}` : k)
        }).join('\r\n')
    } else {
        return `${chalk.greenBright(key)}: ${value}`
    }
}


export default function (value, actions) {
    const [actionType] = Object.keys(actions);
    const action = actions[actionType];
    switch (actionType) {
        case 'get':
            const v = configStore.get(action);
            if (!v) return console.log(`${logSymbols.warning}  NOT FOUND ${chalk.greenBright(action)} KEY`)
            console.log(`${chalk.greenBright(action)}: ${v}`)
            break;
        case 'set':
            if (!value) return console.log(`${logSymbols.warning}  Please set ${action} a value`)
            configStore.set(action, value);
            break;
        case 'all':
            if (action === 'json') {
                console.log(configStore.all)
            } else if (action === 'flat') {
                console.log(formatConfig(configStore.all))
            } else {
                console.log(JSON.stringify(configStore.all, null, 2))
            }
            break;
        case 'delete':
            if (!configStore.get(action)) return;
            configStore.delete(action)
            console.log(`${logSymbols.success} ${chalk.redBright(action)} deleted successfully `)
            break;
    }
}