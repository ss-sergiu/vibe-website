export default {
  name: 'produs',
  title: 'Produs',
  type: 'document',
  fields: [
    { name: 'nume', title: 'Nume produs', type: 'string', validation: (r: any) => r.required() },
    { name: 'descriere', title: 'Descriere', type: 'text', rows: 3 },
    { name: 'pret', title: 'Preț (RON)', type: 'number', validation: (r: any) => r.required().min(0) },
    {
      name: 'categorie',
      title: 'Categorie',
      type: 'string',
      options: {
        list: ['Espresso', 'Specialty', 'Cold', 'Vegan', 'Pastry', 'Alternative'],
      },
    },
    { name: 'imagine', title: 'Imagine', type: 'image', options: { hotspot: true } },
    { name: 'vegan', title: 'Vegan', type: 'boolean', initialValue: false },
    { name: 'disponibil', title: 'Disponibil', type: 'boolean', initialValue: true },
    { name: 'ordine', title: 'Ordine afișare', type: 'number' },
  ],
  orderings: [{ title: 'Ordine', name: 'ordineAsc', by: [{ field: 'ordine', direction: 'asc' }] }],
  preview: {
    select: { title: 'nume', subtitle: 'pret', media: 'imagine' },
    prepare: ({ title, subtitle, media }: any) => ({
      title,
      subtitle: subtitle ? `${subtitle} RON` : '',
      media,
    }),
  },
}
