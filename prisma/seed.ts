import { PrismaClient, SpaceType, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando limpieza parcial y siembra de datos...');

    // 1. LIMPIEZA PARCIAL (Borrar todo excepto el admin principal si existe)
    console.log('🧹 Limpiando tablas de Reservas y Espacios...');
    await prisma.reservation.deleteMany({});
    await prisma.space.deleteMany({});

    console.log('👤 Limpiando usuarios antiguos (manteniendo huerta12@gmail.com)...');
    await prisma.user.deleteMany({
        where: {
            email: {
                not: 'huerta12@gmail.com'
            }
        }
    });

    // 2. CREACIÓN DE USUARIOS PARA PRUEBAS (Playwright)
    console.log('🔑 Creando usuarios de prueba...');
    
    const usersData = [
        {
            email: 'huerta12@gmail.com',
            password: 'admin123',
            name: 'Administrador Principal',
            role: Role.ADMIN
        }
    ];

    for (const userData of usersData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await prisma.user.upsert({
            where: { email: userData.email },
            update: {
                password: hashedPassword,
                role: userData.role,
                name: userData.name
            },
            create: {
                email: userData.email,
                password: hashedPassword,
                role: userData.role,
                name: userData.name
            }
        });
        console.log(`✅ Usuario configurado: ${userData.email}`);
    }

    // 3. CREACIÓN DE ESPACIOS
    console.log('⛺ Creando espacios de camping...');
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
        await prisma.space.create({
            data: space,
        });
        console.log(`✅ Espacio creado: ${space.name}`);
    }

    console.log('✨ Proceso de siembra finalizado exitosamente.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Error durante el seed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
