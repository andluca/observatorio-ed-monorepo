export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]+/g, "-")     // Substitui não-alfanuméricos por hífen
    .replace(/^-+|-+$/g, "");        // Remove hífens do começo/fim
}