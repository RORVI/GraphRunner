import { execute } from '../services/deleteVertex';

const mockSubmit = jest.fn();
jest.mock('../db/gremlinClient', () => ({
  getGremlinClient: () => ({ submit: mockSubmit }),
}));

describe('deleteVertex (unit)', () => {
  beforeEach(() => {
    mockSubmit.mockReset();
  });

  it('should submit the correct Gremlin drop query for a vertex', async () => {
    mockSubmit.mockResolvedValueOnce({});

    const result = await execute('vertex-123');
    expect(mockSubmit).toHaveBeenCalledTimes(1);

    const query = mockSubmit.mock.calls[0][0];
    expect(query).toBe(`g.V('vertex-123').drop()`);

    expect(result).toEqual({ success: true });
  });

  it('should throw and log if vertex deletion fails', async () => {
    mockSubmit.mockRejectedValueOnce(new Error('Vertex not found'));

    await expect(execute('ghost-vertex')).rejects.toThrow('Vertex not found');
    expect(mockSubmit).toHaveBeenCalledWith(`g.V('ghost-vertex').drop()`);
  });
});
