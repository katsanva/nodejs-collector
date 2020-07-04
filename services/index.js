const EventEmitter = require('events');

const FanoutService = require('./fanout.service');
const ReceiverService = require('./receiver.service');
const FilterService = require('./filter.service');
const ReporterService = require('./reporter.service');
const Ajv = require('ajv');

/*
 * This may be async, in case we need
 * to switch from EventEmitter to some external queue
 */
const init = () => {
  const fanout = new FanoutService(new EventEmitter());

  const reporter = new ReporterService(fanout);
  const filter = new FilterService(fanout, new Ajv());
  const receiver = new ReceiverService(fanout);

  return {
    fanout,
    receiver,
    filter,
    reporter,
  };
};

module.exports = init;