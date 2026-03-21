import { PrismaClient, SpaceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    const spacesData = [
        {
            name: 'Estacionamiento Principal',
            description: 'Espacio seguro y accesible para estacionar vehículos, RVs y campers.',
            price: 15.00,
            capacity: 10,
            type: SpaceType.PARKING,
            images: ['/images/gallery/centro.jpeg'],
            isAvailable: true,
        },
        {
            name: 'Gran Campo Abierto',
            description: 'Zona plana y amplia perfecta para acampar en grupo o familias grandes. Hermosa vista a las estrellas.',
            price: 25.00,
            capacity: 8,
            type: SpaceType.OPEN_FIELD,
            images: ['/images/gallery/klalalala.jpeg'],
            isAvailable: true,
        },
        {
            name: 'Palapa Familiar',
            description: 'Área techada (palapa) con parrilla, mesas y bancas. Ideal para convivencias y refugio del sol o lluvia.',
            price: 45.00,
            capacity: 15,
            type: SpaceType.PALAPA,
            images: ['/images/gallery/tyq.jpeg'],
            isAvailable: true,
        },
        {
            name: 'Zona Cerca del Río',
            description: 'Acampa con el relajante sonido del arroyo. Espacios íntimos rodeados de árboles, perfecto para parejas.',
            price: 35.00,
            capacity: 4,
            type: SpaceType.RIVERSIDE,
            images: ['/images/gallery/orilla1.jpeg', '/images/gallery/orrilla del rio.jpeg'],
            isAvailable: true,
        },
        {
            name: 'Cabaña Rustica (Casa)',
            description: 'Pequeña cabaña de madera con comodidades básicas (cama, baño interno). Para quienes buscan confort extra en la naturaleza.',
            price: 85.00,
            capacity: 2,
            type: SpaceType.HOUSE,
            images: ['/images/gallery/hjjdlala.jpeg', '/images/gallery/jhk.jpeg'],
            isAvailable: true,
        },
    ];

    for (const space of spacesData) {
        const spaceRecord = await prisma.space.create({
            data: space,
        });
        console.log(`Created space with id: ${spaceRecord.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
