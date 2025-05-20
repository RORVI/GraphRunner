import { execute } from '../services/getEdge';

const mockSubmit = jest.fn();
jest.mock('../db/gremlinClient', () => ({
  getGremlinClient: () => ({ submit: mockSubmit }),
}));

describe('getEdge (unit)', () => {
  beforeEach(() => {
    mockSubmit.mockReset();
  });

  it('should submit a correct Gremlin query to fetch edge by ID', async () => {
    mockSubmit.mockResolvedValueOnce({ _items: [{ id: 'edge-123', label: 'CONNECTED_TO' }] });

    const result = await execute('edge-123');

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith(`g.E('edge-123').elementMap()`);
    expect(result).toEqual({ id: 'edge-123', label: 'CONNECTED_TO' });
  });

  it('should return null when edge is not found', async () => {
    mockSubmit.mockResolvedValueOnce({ _items: [] });

    const result = await execute('non-existent-edge');
    expect(result).toBeNull();
  });

  it('should throw and log when query fails', async () => {
    mockSubmit.mockRejectedValueOnce(new Error('DB timeout'));

    await expect(execute('edge-err')).rejects.toThrow('DB timeout');
    expect(mockSubmit).toHaveBeenCalledWith(`g.E('edge-err').elementMap()`);
  });
});
