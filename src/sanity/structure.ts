import type { StructureResolver } from 'sanity/structure'

// Sadece mevcut olan şemaları otomatik listelemesi için:
export const structure: StructureResolver = (S) =>
  S.list()
    .title('EkolHome Yönetim')
    .items(S.documentTypeListItems())