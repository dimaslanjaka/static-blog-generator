import { encodeURL } from '../../src/utils/encode-url';

describe('encodeURL', () => {
  it('regular', () => {
    const content = 'http://foo.com/';
    expect(encodeURL(content)).toBe(content);
  });

  it('auth', () => {
    const content = 'http://user:pass@foo.com/';
    expect(encodeURL(content)).toBe(content);
  });

  it('port', () => {
    const content = 'http://foo.com:8080/';
    expect(encodeURL(content)).toBe(content);
  });

  it('space', () => {
    const content = 'http://foo.com/bar baz';
    expect(encodeURL(content)).toBe('http://foo.com/bar%20baz');
  });

  it('unicode', () => {
    const content = 'http://foo.com/bár';
    expect(encodeURL(content)).toBe('http://foo.com/b%C3%A1r');
  });

  it('encode once', () => {
    const content = 'http://foo.com/b%C3%A1%20r';
    expect(encodeURL(content)).toBe(content);
  });

  it('hash', () => {
    const content = 'http://foo.com/bár#bàz';
    expect(encodeURL(content)).toBe('http://foo.com/b%C3%A1r#b%C3%A0z');
  });

  it('query', () => {
    const content = 'http://foo.com/bar?qúery=báz';
    expect(encodeURL(content)).toBe('http://foo.com/bar?q%C3%BAery=b%C3%A1z');
  });

  it('query contains %', () => {
    const content = 'http://foo.com/bar?query=%';
    expect(encodeURL(content)).toBe('http://foo.com/bar?query=%25');
  });

  it('path or query contains %', () => {
    const content = '/bar?query=%';
    expect(encodeURL(content)).toBe('/bar?query=%25');
  });

  it('multiple queries', () => {
    const content = 'http://foo.com/bar?query1=aáa&query2=aàa';
    expect(encodeURL(content)).toBe('http://foo.com/bar?query1=a%C3%A1a&query2=a%C3%A0a');
  });

  it('hash and query', () => {
    const content = 'http://foo.com/bar?query=báz#fóo';
    expect(encodeURL(content)).toBe('http://foo.com/bar?query=b%C3%A1z#f%C3%B3o');
  });

  it('perserve escape in search', () => {
    // https://github.com/hexojs/hexo-util/issues/411
    const content = 'https://fóo.com/path?search1=2%2B2&search2=bár';
    expect(encodeURL(content)).toBe(content.replace('bár', 'b%C3%A1r'));
  });

  it('idn', () => {
    const content = 'http://bár.com/baz';
    expect(encodeURL(content)).toBe('http://bár.com/baz');
  });

  it('idn - punycode', () => {
    const content = 'http://xn--br-mia.com/baz';
    expect(encodeURL(content)).toBe('http://bár.com/baz');
  });

  it('path', () => {
    const content = '/foo/bar/';
    expect(encodeURL(content)).toBe(content);
  });

  it('path with space', () => {
    const content = '/foo bar/baz/';
    expect(encodeURL(content)).toBe('/foo%20bar/baz/');
  });

  it('path with unicode', () => {
    const content = '/foo/bár/';
    expect(encodeURL(content)).toBe('/foo/b%C3%A1r/');
  });

  it('encode once', () => {
    const content = '/foo/b%C3%A1r%20/';
    expect(encodeURL(content)).toBe(content);
  });

  it('anchor with unicode', () => {
    const content = '#fóo-bár';
    expect(encodeURL(content)).toBe('#f%C3%B3o-b%C3%A1r');
  });

  it('data URLs', () => {
    const content = 'data:,Hello%2C%20World!';
    expect(encodeURL(content)).toBe(content);
  });
  it('encode pathname', () => {
    const content = 'https://fóo.com/páth%20[square]';
    expect(encodeURL(content)).toBe('https://fóo.com/p%C3%A1th%20%5Bsquare%5D');
  });

  it('should encode a simple URL', () => {
    expect(encodeURL('http://example.com/foo bar')).toBe('http://example.com/foo%20bar');
  });

  it('should encode a URL with query params', () => {
    expect(encodeURL('https://example.com/search?q=hello world')).toBe('https://example.com/search?q=hello%20world');
  });

  it('should preserve IDN (unicode domains)', () => {
    expect(encodeURL('http://xn--fsq.com/ü')).toBe('http://例.com/%C3%BC');
  });

  it('should return data URLs unchanged', () => {
    const dataUrl = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D';
    expect(encodeURL(dataUrl)).toBe(dataUrl);
  });

  it('should encode a string that is not a full URL', () => {
    expect(encodeURL('foo bar')).toBe('foo%20bar');
  });
});
