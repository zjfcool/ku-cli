# ku-cli
a ku cli
# Install
```shell
npm install ku-cli -g
```
# Usage
```shell
$ ku --help
Usage: ku <command> [option]

Options:
  -V, --version                    output the version number
  -h, --help                       display help for command

Commands:
  create [options] <project-name>  create a new project
  config [options] [value]         inspect and modify config
  ui [options]                     start and open ku-cli ui
  help [command]                   display help for command

Run ku <command> --help for detailed usage of given command.
```
```shell
$ ku create --help
Usage: ku create [options] <project-name>

create a new project

Options:
  -f,--force  overwrite target directory if it exists
  -h, --help  display help for command
```
```shell
$ ku config --help
Usage: ku config [options] [value]

inspect and modify config

Options:
  -g,--get <path>          get value from option   
  -s,--set <path> <value>  set config
  -d,--delete <path>       delete value from option
  -a,--all [value]         get all config
  -h, --help               display help for command
```
```shell
$ ku config -a
{
  "organization": "aha-ku"//表示组织名称,模板列表将在此组织下拉取
}
```