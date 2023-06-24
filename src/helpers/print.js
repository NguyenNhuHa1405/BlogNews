import chalk from 'chalk';
class OutputType {
    static INFORMATION = 'INFORMATION';
    static SUCCESS = 'SUCCESS';
    static WARNING = 'WANNING';
    static ERROR = 'ERROR';
}
function print(massege, outputType) {
    switch(outputType) {
        case OutputType.INFORMATION:
            console.log(chalk.white(massege));
            break;
        case OutputType.SUCCESS:
            console.log(chalk.green(massege));
            break;
        case OutputType.ERROR:
            console.log(chalk.red(massege));
            break;
        case OutputType.WARNING:
            console.log(chalk.yellow(massege));
            break;
        default:
            console(chalk.white(massege));
    }
    
}
export { OutputType,print }