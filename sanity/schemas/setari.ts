export default {
  name: 'setari',
  title: 'Setări Site',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    { name: 'numeCafenea', title: 'Nume cafenea', type: 'string' },
    { name: 'slogan', title: 'Slogan (subtitlu hero)', type: 'string' },
    { name: 'adresa', title: 'Adresă', type: 'string' },
    { name: 'telefon', title: 'Telefon', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'orareProgram', title: 'Program orar', type: 'text', rows: 3 },
  ],
}
