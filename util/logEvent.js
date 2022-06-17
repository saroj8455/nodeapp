import { format } from 'date-fns';
import { v4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export const logEvent = async (message) => {
  const fsPromises = fs.promises;
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logMessage = `${dateTime}\t${v4()}\t${message}\n`;
  const _dirname = path.resolve();
  const log_filename = `${format(new Date(), 'yyyy-MM-dd')}.log`; // 2022-06-07.log
  console.log(logMessage);
  try {
    // check if the logs file exists or not
    if (!fs.existsSync(path.join(_dirname, 'logs'))) {
      await fsPromises.mkdir(path.join(_dirname, 'logs'));
    }
    // if the file is there then it will append the content
    await fsPromises.appendFile(
      path.join(_dirname, 'logs', log_filename),
      logMessage
    );
  } catch (error) {
    console.log(error);
  }
};

export const logger = (req, resp, next) => {
  logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`);
  console.log(req.method, req.path);
  next();
};
