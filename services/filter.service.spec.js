const FilterService = require('./filter.service');

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
  const s = new FilterService(fanout, i, o);

  expect(fanout.subscribe).toHaveBeenCalledWith(i, expect.anything());
});

test('should publish valid data', () => {
  const s = new FilterService(fanout, i, o);
  const data = { data: { id: 123 }, timestamp: 111 };

  s.filter(data);

  expect(fanout.publish).toHaveBeenCalledWith(o, data);
});

test('should filter out wrong data', () => {
  const s = new FilterService(fanout, i, o);
  const data = { data: { ids: 123 }, timestamp: 111 };

  s.filter(data);

  expect(fanout.publish).not.toHaveBeenCalled();
});
