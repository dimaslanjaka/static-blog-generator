import decodeURL from '../../src/utils/decode-url';

describe('decodeURL', () => {
  it('regular', () => {
    const content = 'http://foo.com/';
    expect(decodeURL(content)).toBe(content);
  });

  it('auth', () => {
    const content = 'http://user:pass@foo.com/';
    expect(decodeURL(content)).toBe(content);
  });

  it('port', () => {
    const content = 'http://foo.com:8080/';
    expect(decodeURL(content)).toBe(content);
  });

  it('space', () => {
    const content = 'http://foo.com/bar%20baz';
    expect(decodeURL(content)).toBe('http://foo.com/bar baz');
  });

  it('unicode', () => {
    const content = 'http://foo.com/b%C3%A1r';
    expect(decodeURL(content)).toBe('http://foo.com/bár');
  });

  it('decode once', () => {
    const content = 'http://fóo.com/bár';
    expect(decodeURL(content)).toBe(content);
  });

  it('hash', () => {
    const content = 'http://foo.com/b%C3%A1r#b%C3%A0z';
    expect(decodeURL(content)).toBe('http://foo.com/bár#bàz');
  });

  it('query', () => {
    const content = 'http://foo.com/bar?q%C3%BAery=b%C3%A1z';
    expect(decodeURL(content)).toBe('http://foo.com/bar?qúery=báz');
  });

  it('multiple queries', () => {
    const content = 'http://foo.com/bar?query1=a%C3%A1a&query2=a%C3%A0a';
    expect(decodeURL(content)).toBe('http://foo.com/bar?query1=aáa&query2=aàa');
  });

  it('hash and query', () => {
    const content = 'http://foo.com/bar?query=b%C3%A1z#f%C3%B3o';
    expect(decodeURL(content)).toBe('http://foo.com/bar?query=báz#fóo');
  });

  it('idn', () => {
    const content = 'http://xn--br-mia.com/baz';
    expect(decodeURL(content)).toBe('http://bár.com/baz');
  });

  it('path', () => {
    const content = '/foo/bar/';
    expect(decodeURL(content)).toBe(content);
  });

  it('path with space', () => {
    const content = '/foo%20bar/baz/';
    expect(decodeURL(content)).toBe('/foo bar/baz/');
  });

  it('path with unicode', () => {
    const content = '/foo/b%C3%A1r/';
    expect(decodeURL(content)).toBe('/foo/bár/');
  });

  it('decode path once', () => {
    const content = '/foo/bár /';
    expect(decodeURL(content)).toBe(content);
  });

  it('anchor with unicode', () => {
    const content = '#f%C3%B3o-b%C3%A1r';
    expect(decodeURL(content)).toBe('#fóo-bár');
  });

  it('data url', () => {
    const content = 'data:image/png;base64';
    expect(decodeURL(content)).toBe('data:image/png;base64');
  });

  it('should decode a simple URL', () => {
    expect(decodeURL('http://example.com/foo%20bar')).toBe('http://example.com/foo bar');
  });

  it('should decode a URL with query params', () => {
    expect(decodeURL('https://example.com/search?q=hello%20world')).toBe('https://example.com/search?q=hello world');
  });

  it('should decode unicode in path', () => {
    expect(decodeURL('http://foo.com/b%C3%A1r')).toBe('http://foo.com/bár');
  });

  it('should decode hash and query', () => {
    expect(decodeURL('http://foo.com/bar?query=b%C3%A1z#f%C3%B3o')).toBe('http://foo.com/bar?query=báz#fóo');
  });

  it('should return data URLs unchanged', () => {
    const dataUrl = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D';
    expect(decodeURL(dataUrl)).toBe(dataUrl);
  });

  it('should decode a string that is not a full URL', () => {
    expect(decodeURL('foo%20bar')).toBe('foo bar');
  });
});
