import { execute } from '../services/getVertex';

const mockSubmit = jest.fn();
jest.mock('../db/gremlinClient', () => ({
  getGremlinClient: () => ({ submit: mockSubmit }),
}));

describe('getVertex (unit)', () => {
  beforeEach(() => {
    mockSubmit.mockReset();
  });

  it('should build the correct query and return the vertex result', async () => {
    mockSubmit.mockResolvedValueOnce({
      _items: [{ id: 'vertex-123', label: 'DEVICE', ip: '192.168.0.1' }],
    });

    const result = await execute('vertex-123');

    expect(mockSubmit).toHaveBeenCalledWith(`g.V('vertex-123').elementMap()`);
    expect(result).toEqual({ id: 'vertex-123', label: 'DEVICE', ip: '192.168.0.1' });
  });

  it('should return null if no vertex is found', async () => {
    mockSubmit.mockResolvedValueOnce({ _items: [] });

    const result = await execute('ghost-vertex');
    expect(result).toBeNull();
  });

  it('should throw if the query fails', async () => {
    mockSubmit.mockRejectedValueOnce(new Error('timeout'));

    await expect(execute('vertex-fail')).rejects.toThrow('timeout');
    expect(mockSubmit).toHaveBeenCalledWith(`g.V('vertex-fail').elementMap()`);
  });
});
