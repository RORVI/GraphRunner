import { execute } from '../services/updateEdge';

const mockSubmit = jest.fn();
jest.mock('../db/gremlinClient', () => ({
  getGremlinClient: () => ({ submit: mockSubmit }),
}));

describe('updateEdge (unit)', () => {
  beforeEach(() => {
    mockSubmit.mockReset();
  });

  it('should build and submit an update query with properties', async () => {
    mockSubmit.mockResolvedValueOnce({ _items: ['updated'] });

    const result = await execute('edge-42', {
      protocol: 'UDP',
      port: '53'
    });

    const query = mockSubmit.mock.calls[0][0];
    expect(query).toContain(`g.E('edge-42')`);
    expect(query).toContain(`.property('protocol', "UDP")`);
    expect(query).toContain(`.property('port', "53")`);
    expect(result).toEqual({ _items: ['updated'] });
  });

  it('should ignore empty or non-string props', async () => {
    mockSubmit.mockResolvedValueOnce({ _items: [] });

    await execute('edge-10', {
      protocol: 'TCP',
      port: ' ', // should be skipped
      debug: null, // should be skipped
      retries: undefined // should be skipped
    });

    const query = mockSubmit.mock.calls[0][0];
    expect(query).toContain(`.property('protocol', "TCP")`);
    expect(query).not.toContain('port');
    expect(query).not.toContain('debug');
    expect(query).not.toContain('retries');
  });

  it('should escape quotes in property values', async () => {
    mockSubmit.mockResolvedValueOnce({});

    await execute('edge-9', {
      note: `He said "restart"`
    });

    const query = mockSubmit.mock.calls[0][0];
    expect(query).toContain(`He said \\\"restart\\\"`);
  });

  it('should throw and log if Gremlin query fails', async () => {
    mockSubmit.mockRejectedValueOnce(new Error('Update failed'));

    await expect(
      execute('edge-error', { protocol: 'ICMP' })
    ).rejects.toThrow('Update failed');

    expect(mockSubmit).toHaveBeenCalled();
  });
});
