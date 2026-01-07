// This fakes the entire redisClient for all tests

const redisClient = {
  on: jest.fn(),
  connect: jest.fn().mockResolvedValue(null),
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  quit: jest.fn().mockResolvedValue(null),
  isOpen: true,
};

export default redisClient;