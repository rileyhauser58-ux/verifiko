const EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/g;

// Secuencias de dígitos/separadores plausibles como teléfono chileno
// (+56 9 XXXX XXXX, fijos de 8 dígitos, etc.). Es un desincentivo, no un
// filtro infalible — igual que en marketplaces como Airbnb o Fiverr.
const PHONE_CANDIDATE_REGEX = /(?:\+?56[\s.-]?)?(?:9[\s.-]?)?(?:\d[\s.-]?){7,10}\d/g;

export function maskContactInfo(text: string): string {
  return text
    .replace(EMAIL_REGEX, "[correo oculto]")
    .replace(PHONE_CANDIDATE_REGEX, (match) => {
      const digitCount = match.replace(/\D/g, "").length;
      return digitCount >= 7 ? "[teléfono oculto]" : match;
    });
}
