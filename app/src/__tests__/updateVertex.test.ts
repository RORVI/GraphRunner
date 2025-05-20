import { execute } from '../services/updateVertex';

const mockSubmit = jest.fn();
jest.mock('../db/gremlinCLient', () => ({
  getGremlinClient: () => ({ submit: mockSubmit }),
}));

describe('updateVertex (unit)', () => {
  beforeEach(() => {
    mockSubmit.mockReset();
  });

  it('should build and submit an update query with valid props', async () => {
    mockSubmit.mockResolvedValueOnce({ _items: ['updated'] });

    const result = await execute('vertex-1', {
      os: 'Linux',
      role: 'Router'
    });

    const query = mockSubmit.mock.calls[0][0];
    expect(query).toContain(`g.V('vertex-1')`);
    expect(query).toContain(`.property('os', "Linux")`);
    expect(query).toContain(`.property('role', "Router")`);
    expect(result).toEqual({ _items: ['updated'] });
  });

  it('should skip blank or non-string updates', async () => {
    mockSubmit.mockResolvedValueOnce({});

    await execute('vertex-99', {
      os: 'FreeBSD',
      location: '  ',
      retryCount: null
    });

    const query = mockSubmit.mock.calls[0][0];
    expect(query).toContain(`.property('os', "FreeBSD")`);
    expect(query).not.toContain('location');
    expect(query).not.toContain('retryCount');
  });

  it('should escape quotes in values', async () => {
    mockSubmit.mockResolvedValueOnce({});

    await execute('vertex-escape', {
      note: `He said "don't panic"`
    });

    const query = mockSubmit.mock.calls[0][0];
    expect(query).toContain(`He said \\\"don't panic\\\"`);
  });

  it('should throw if the update fails', async () => {
    mockSubmit.mockRejectedValueOnce(new Error('Vertex update failed'));

    await expect(
      execute('vertex-fail', { version: '1.0' })
    ).rejects.toThrow('Vertex update failed');

    expect(mockSubmit).toHaveBeenCalled();
  });
});
