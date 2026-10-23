/**
 * The loading logo is embedded in styles.scss as a base64 data URI. A single
 * character lost from that string turns it into an invalid URL: the browser
 * logs ERR_INVALID_URL and the logo never shows while the app loads.
 *
 * Karma loads src/styles.scss as a global stylesheet, so the real rule is
 * resolved here and the image is decoded by the browser itself.
 */
describe('Global styles: loading logo', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
    host.className = 'app-loading';
    host.innerHTML = '<div class="logo"></div>';
    document.body.appendChild(host);
  });

  afterEach(() => host.remove());

  function logoUrl(): string {
    const logo = host.querySelector('.logo') as HTMLElement;
    const background = getComputedStyle(logo).backgroundImage;
    const match = /^url\("?(.*?)"?\)$/.exec(background);
    expect(match)
      .withContext(`background-image: ${background.slice(0, 80)}`)
      .not.toBeNull();
    return match ? match[1] : '';
  }

  it('is an embedded PNG', () => {
    expect(logoUrl().startsWith('data:image/png;base64,')).toBeTrue();
  });

  it('decodes to an image the browser can load', async () => {
    const image = new Image();
    const loaded = new Promise<boolean>((resolve) => {
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
    });
    image.src = logoUrl();

    expect(await loaded)
      .withContext('the data URI does not decode to a valid image')
      .toBeTrue();
    expect(image.naturalWidth).toBeGreaterThan(0);
  });
});
