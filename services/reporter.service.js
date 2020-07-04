var debug = require('debug')('nodejs-collector:reporter');

const { TOPIC_DATA_FILTERED } = require('../lib/constants');

module.exports = class ReporterService {
  /**
   *
   * @param {import('./fanout.service')} fanout
   */
  constructor(fanout) {
    this.fanout = fanout;

    this.listen();
  }

  listen() {
    this.fanout.subscribe(TOPIC_DATA_FILTERED, (data) => this.report(data));
  }

  report(data) {
    console.log(data);
  }
};
