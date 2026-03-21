/**
 * Script de parche: actualiza las imágenes de todos los Space
 * que aún tienen URLs de Unsplash (o cualquier URL http/https)
 * y las reemplaza por imágenes locales según el tipo de espacio.
 *
 * Ejecutar: npx tsx prisma/patch-images.ts
 */
import { PrismaClient, SpaceType } from '@prisma/client';

const prisma = new PrismaClient();

const localImagesByType: Record<string, string[]> = {
    [SpaceType.PARKING]:    ['/images/gallery/centro.jpeg'],
    [SpaceType.OPEN_FIELD]: ['/images/gallery/klalalala.jpeg'],
    [SpaceType.PALAPA]:     ['/images/gallery/tyq.jpeg'],
    [SpaceType.RIVERSIDE]:  ['/images/gallery/orilla1.jpeg', '/images/gallery/orrilla del rio.jpeg'],
    [SpaceType.HOUSE]:      ['/images/gallery/hjjdlala.jpeg', '/images/gallery/jhk.jpeg'],
};

async function main() {
    const spaces = await prisma.space.findMany();

    let updated = 0;
    for (const space of spaces) {
        const hasExternalImages = space.images.some(img => img.startsWith('http'));
        if (hasExternalImages) {
            const newImages = localImagesByType[space.type] ?? ['/images/gallery/1.jpeg'];
            await prisma.space.update({
                where: { id: space.id },
                data: { images: newImages },
            });
            console.log(`✔ Actualizado: "${space.name}" (${space.type}) → ${newImages.join(', ')}`);
            updated++;
        }
    }

    if (updated === 0) {
        console.log('No se encontraron espacios con imágenes externas. Todo está bien.');
    } else {
        console.log(`\n✅ ${updated} espacio(s) actualizado(s).`);
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
