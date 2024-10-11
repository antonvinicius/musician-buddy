import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.instrument.createMany({
    data: [
      { name: 'Violão', icon: 'guitar' },       
      { name: 'Guitarra Elétrica', icon: 'guitar-electric' }, 
      { name: 'Bateria', icon: 'drum' },       
      { name: 'Baixo', icon: 'guitar' },         
      { name: 'Teclado', icon: 'keyboard' },  
      { name: 'Piano', icon: 'piano' },        
      { name: 'Saxofone', icon: 'saxophone' },   
      { name: 'Violino', icon: 'violin' },       
      { name: 'Flauta', icon: 'music' },      
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
