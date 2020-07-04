const EventEmitter = require('events');

const FanoutService = require('./fanout.service');
const ReceiverFacadeService = require('./receiver-facade.service');
const ReporterService = require('./reporter.service');
const { TOPIC_DATA_RECEIVED } = require('../lib/constants');

/*
 * This may be async, in case we need
 * to switch from EventEmitter to some external queue
 */
const init = () => {
  const fanout = new FanoutService(new EventEmitter());

  const reporter = new ReporterService(fanout, TOPIC_DATA_RECEIVED);
  const receiver = new ReceiverFacadeService(fanout, TOPIC_DATA_RECEIVED);

  return {
    fanout,
    receiver,
    reporter,
  };
};

module.exports = init;
