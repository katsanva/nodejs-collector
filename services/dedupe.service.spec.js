const { DEDUPE_INTERVAL } = require('../lib/constants');

const fanout = {
  subscribe: jest.fn(() => {}),
  publish: jest.fn(),
};
const i = 'i';
const o = 'o';

beforeEach(() => {
  fanout.subscribe.mockClear();
  fanout.publish.mockClear();
});

test('should subscribe on i', () => {
  const DedupeService = require('./dedupe.service');
  const s = new DedupeService(fanout, i, o);

  expect(fanout.subscribe).toHaveBeenCalledWith(i, expect.anything());
});

test('should publish on first call', () => {
  const DedupeService = require('./dedupe.service');
  const s = new DedupeService(fanout, i, o);

  const data = { foo: 'bla' };
  s.dedupe(data);

  expect(fanout.publish).toHaveBeenCalledWith(o, data);
});

test('should not publish on second call', () => {
  const DedupeService = require('./dedupe.service');
  const s = new DedupeService(fanout, i, o);

  const data = { foo: 'bla' };
  s.dedupe(data);
  expect(fanout.publish).toHaveBeenCalledWith(o, data);

  s.dedupe(data);

  expect(fanout.publish).toHaveBeenCalledTimes(1);
});

test('should publish different data as well', () => {
  const DedupeService = require('./dedupe.service');
  const s = new DedupeService(fanout, i, o);

  const data = { data: { foo: 'bla' } };
  s.dedupe(data);
  expect(fanout.publish).toHaveBeenCalledWith(o, data);
  s.dedupe(data);
  expect(fanout.publish).toHaveBeenCalledTimes(1);
  const otherData = { data: { foo: 'bar' } };
  s.dedupe(otherData);
  expect(fanout.publish).toHaveBeenCalledTimes(2);
});

test('should publish on second call after some timeout', async () => {
  jest.setTimeout(30_1000);
  const DedupeService = require('./dedupe.service');
  const s = new DedupeService(fanout, i, o);

  const data = { data: { foo: Date.now() } };
  s.dedupe(data);

  expect(fanout.publish).toHaveBeenCalledWith(o, data);

  await new Promise((r) => setTimeout(r, DEDUPE_INTERVAL + 100));

  s.dedupe(data);

  expect(fanout.publish).toHaveBeenCalledTimes(2);
});
