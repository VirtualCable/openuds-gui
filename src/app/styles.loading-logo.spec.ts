// Karma injects src/styles.scss globally, so the real .app-loading rule applies here.
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
