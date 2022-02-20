import { createWriteStream } from 'fs';
import pinoms from 'pino-multi-stream';

const prettyStream = pinoms.prettyStream({
  prettyPrint: {
    colorize: true,
  },
});

const streams = [
  { stream: prettyStream },
  { stream: createWriteStream(`${process.cwd()}/logs.log`) },
];

export const logger = pinoms({ streams: streams });
