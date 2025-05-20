import { execute } from '../services/deleteEdge';

const mockSubmit = jest.fn();
jest.mock('../db/gremlinClient', () => ({
  getGremlinClient: () => ({ submit: mockSubmit }),
}));

describe('deleteEdge (unit)', () => {
  beforeEach(() => {
    mockSubmit.mockReset();
  });

  it('should submit the correct Gremlin drop query', async () => {
    mockSubmit.mockResolvedValueOnce({});

    const result = await execute('edge-123');
    expect(mockSubmit).toHaveBeenCalledTimes(1);

    const query = mockSubmit.mock.calls[0][0];
    expect(query).toBe(`g.E('edge-123').drop()`);

    expect(result).toEqual({ success: true });
  });

  it('should throw and log if submit fails', async () => {
    mockSubmit.mockRejectedValueOnce(new Error('Delete failed'));

    await expect(execute('edge-404')).rejects.toThrow('Delete failed');
    expect(mockSubmit).toHaveBeenCalledWith(`g.E('edge-404').drop()`);
  });
});
