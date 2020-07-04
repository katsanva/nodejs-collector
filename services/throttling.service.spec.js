const { THROTTLE_CACHE_SIZE } = require('../lib/constants');

const fanout = {
  subscribe: jest.fn(() => {}),
  publish: jest.fn(),
};
const i = 'i';
const o = 'o';

jest.useFakeTimers();

beforeEach(() => {
  fanout.subscribe.mockClear();
  fanout.publish.mockClear();
});

test('should subscribe on i', () => {
  const ThrottlingService = require('./throttling.service');
  const s = new ThrottlingService(fanout, i, o);

  expect(fanout.subscribe).toHaveBeenCalledWith(i, expect.anything());
});

test('should not publish on first call', () => {
  const ThrottlingService = require('./throttling.service');
  const s = new ThrottlingService(fanout, i, o);

  s.throttle({});

  expect(fanout.publish).not.toHaveBeenCalled();
});

test('should publish on nth call', () => {
  const ThrottlingService = require('./throttling.service');
  const s = new ThrottlingService(fanout, i, o);

  for (let i = 0; i <= THROTTLE_CACHE_SIZE; i++) {
    s.throttle({});
  }

  expect(fanout.publish).toHaveBeenCalledTimes(THROTTLE_CACHE_SIZE);
});

test('should publish cache after the timeout', () => {
  const ThrottlingService = require('./throttling.service');
  const s = new ThrottlingService(fanout, i, o);

  for (let i = 0; i <= THROTTLE_CACHE_SIZE; i++) {
    s.throttle({});
  }

  expect(fanout.publish).toHaveBeenCalledTimes(THROTTLE_CACHE_SIZE);

  jest.runAllTimers();

  expect(fanout.publish).toHaveBeenCalledTimes(THROTTLE_CACHE_SIZE + 1);
});
