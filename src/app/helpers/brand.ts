export const LAUNCHER_NAME = 'UDS Launcher';

/**
 * Puts the launcher name into an already translated text.
 *
 * Product names are not translated, so every catalog entry that mentions the
 * launcher carries it as the %(launcher)s placeholder instead of the name.
 */
export function withLauncherName(text: string): string {
  return django.interpolate(text, { launcher: LAUNCHER_NAME }, true);
}
