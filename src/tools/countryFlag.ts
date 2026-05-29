import COUNTRY_NAME_TO_ISO2 from 'constants/countryNameToIso2.json';

const REGIONAL_INDICATOR_A = 0x1f1e6;

export function iso2ToFlagEmoji(iso2: string): string {
  const code = iso2.toUpperCase();

  if (!/^[A-Z]{2}$/.test(code)) return '';

  return String.fromCodePoint(
    ...[...code].map(char => REGIONAL_INDICATOR_A + char.charCodeAt(0) - 65),
  );
}

export function countryNameToFlagEmoji(
  country: string | undefined | null,
): string {
  if (!country) return '—';

  if (/^[A-Za-z]{2}$/.test(country)) {
    const flag = iso2ToFlagEmoji(country);

    return flag || '—';
  }

  const iso2 =
    COUNTRY_NAME_TO_ISO2[country as keyof typeof COUNTRY_NAME_TO_ISO2];

  if (!iso2) return '—';

  return iso2ToFlagEmoji(iso2) || '—';
}
