import {createLogger, format, transports} from 'winston';

const {timestamp, printf, label} = format;

const defaultLevel = process.env.LOG_LEVEL;
const loggingFormat = printf(({level, message, timestamp: time, label: name}) => {
  return `${time} ${level} (${name}): ${message}`;
});

export default class LoggerUtils {

  // Create and configure default Logger
  public static createLogger(name: string) {
    return createLogger({
      defaultMeta: {command: name},
      exitOnError: false,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.label({label: name}),
        format.errors({stack: true}),
        format.splat(),
        format.json(),
      ),
      level: defaultLevel,
      transports: [
        // - Write all logs error (and above) to Console/terminal
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.label({label: name}),
            timestamp(),
            loggingFormat,
          ),
        }),
      ],
    });
  }
}
