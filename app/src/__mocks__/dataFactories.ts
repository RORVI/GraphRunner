export function mockVertex(overrides = {}) {
    return {
      label: 'DEVICE',
      ip: '192.168.0.42',
      hostname: 'unit-test-device',
      ...overrides
    };
  }
  