import { handleIngestion } from '../services/ingestService';

const mockSubmit = jest.fn();
jest.mock('../db/gremlinClient', () => ({
  getGremlinClient: () => ({ submit: mockSubmit }),
}));

describe('handleIngestion (unit)', () => {
  beforeEach(() => {
    mockSubmit.mockReset();
  });

  it('should submit queries for all valid vertices and edges', async () => {
    mockSubmit.mockResolvedValue({});

    const vertices = [
      {
        label: 'DEVICE',
        props: {
          ip: '192.168.0.1',
          hostname: 'host-a'
        }
      }
    ];

    const edges = [
      {
        label: 'CONNECTED_TO',
        fromKey: 'hostname',
        fromVal: 'host-a',
        toKey: 'hostname',
        toVal: 'host-b',
        props: {
          protocol: 'TCP',
          port: '443'
        }
      }
    ];

    await handleIngestion(vertices, edges);

    expect(mockSubmit).toHaveBeenCalledTimes(2);

    const vertexQuery = mockSubmit.mock.calls[0][0];
    expect(vertexQuery).toContain(`addV('DEVICE')`);
    expect(vertexQuery).toContain(`.property('ip', "192.168.0.1")`);
    expect(vertexQuery).toContain(`.property('hostname', "host-a")`);

    const edgeQuery = mockSubmit.mock.calls[1][0];
    expect(edgeQuery).toContain(`addE('CONNECTED_TO')`);
    expect(edgeQuery).toContain(`.property('protocol', "TCP")`);
    expect(edgeQuery).toContain(`.property('port', "443")`);
  });

  it('should skip malformed props (empty, invalid, or templated)', async () => {
    mockSubmit.mockResolvedValue({});

    const vertices = [
      {
        label: 'SERVICE',
        props: {
          ip: '{{faker.internet.ip}}', // should be ignored
          name: '',
          port: '8080'
        }
      }
    ];

    const edges = [
      {
        label: 'LINKS',
        fromKey: 'name',
        fromVal: 'svc-a',
        toKey: 'name',
        toVal: 'svc-b',
        props: {
          metadata: undefined,
          debug: '  ',
          protocol: 'UDP'
        }
      }
    ];

    await handleIngestion(vertices, edges);

    const vQuery = mockSubmit.mock.calls[0][0];
    const eQuery = mockSubmit.mock.calls[1][0];

    expect(vQuery).toContain(`.property('port', "8080")`);
    expect(vQuery).not.toContain('ip');
    expect(vQuery).not.toContain('name');

    expect(eQuery).toContain(`.property('protocol', "UDP")`);
    expect(eQuery).not.toContain('metadata');
    expect(eQuery).not.toContain('debug');
  });

  it('should sanitize newline, quote, and slash characters', async () => {
    mockSubmit.mockResolvedValue({});

    await handleIngestion(
      [{
        label: 'NODE',
        props: {
          desc: 'multi\nline "quoted" text\\'
        }
      }],
      []
    );

    const query = mockSubmit.mock.calls[0][0];
    expect(query).toContain(`multi line "quoted" text`);
    expect(query).not.toMatch(/[\n\r]/);
    expect(query).not.toContain(`\\"`); // no double escaping
  });

  it('should handle empty arrays gracefully', async () => {
    await handleIngestion([], []);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should throw if any Gremlin call fails', async () => {
    mockSubmit.mockRejectedValueOnce(new Error('Kaboom'));

    await expect(
      handleIngestion([{ label: 'BROKEN', props: { foo: 'bar' } }], [])
    ).rejects.toThrow('Kaboom');

    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
