import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed...');

    await prisma.filme.createMany({
        data: [
            {
                title: 'O Jogo da Imitação',
                description: 'Cinebiografia do criptoanalista Alan Turing.',
                duration: 114,
                genre: 'Drama',
                rating: (8.0),
                available: true,
            },
            {
                title: 'Matrix',
                description: 'Um jovem programador descobre que o mundo é uma simulação.',
                duration: 136,
                genre: 'Ficção Científica',
                rating: (8.7),
                available: true,
            },
            {
                title: 'A Rede Social',
                description: 'A história da criação do Facebook.',
                duration: 120,
                genre: 'Drama',
                rating: (7.8),
                available: false,
            },
            {
                title: 'Interestelar',
                description: 'Exploradores viajam através de um buraco de minhoca.',
                duration: 169,
                genre: 'Ficção Científica',
                rating: (8.7),
                available: true,
            },
            {
                title: 'Oppenheimer',
                description: 'A história do físico J. Robert Oppenheimer.',
                duration: 180,
                genre: 'História',
                rating: (8.4),
                available: true,
            },
            {
                title: "Clube da Luta",
                description: "Um homem descontente com sua vida cria um clube clandestino de lutas.",
                duration: 139,
                genre: "Drama",
                rating: (8.80),
                available: true
            },
            {
                title: "Forrest Gump",
                description: "A história de um homem simples que vive momentos históricos dos EUA.",
                duration: 142,
                genre: "Drama",
                rating: (8.80),
                available: true
            },
            {
                title: "Gladiador",
                description: "Um general romano busca vingança após ser traído.",
                duration: 155,
                genre: "Ação",
                rating: (8.50),
                available: false
            },
            {
                title: "O Senhor dos Anéis: A Sociedade do Anel",
                description: "Um hobbit embarca em uma jornada para destruir um anel poderoso.",
                duration: 178,
                genre: "Fantasia",
                rating: (8.80),
                available: true
            },
            {
                title: "Whiplash",
                description: "Um jovem baterista enfrenta um professor extremamente exigente.",
                duration: 107,
                genre: "Drama",
                rating: (8.50),
                available: true
            }

            ],
        });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });