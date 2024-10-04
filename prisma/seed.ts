import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.instrument.createMany({
    data: [
      { name: 'Violão', icon: 'guitar' },         // Violão (acoustic guitar)
      { name: 'Guitarra Elétrica', icon: 'guitar-electric' }, // Guitarra Elétrica
      { name: 'Bateria', icon: 'drum' },          // Bateria
      { name: 'Baixo', icon: 'guitar' },          // Baixo (mesmo ícone de guitarra)
      { name: 'Teclado', icon: 'keyboard' },      // Teclado
      { name: 'Piano', icon: 'piano' },           // Piano
      { name: 'Saxofone', icon: 'saxophone' },    // Saxofone
      { name: 'Violino', icon: 'violin' },        // Violino
      { name: 'Flauta', icon: 'music' },          // Flauta (ícone musical genérico)
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
