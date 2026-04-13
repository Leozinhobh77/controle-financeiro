/**
 * seed.js — Dados iniciais (categorias padrão + config)
 * Executar: npm run db:seed
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categoriasDefault = [
  { id: 'moradia',     nome: 'Moradia',     cor: '#6366F1', icone: '🏠', ordem: 1 },
  { id: 'alimentacao', nome: 'Alimentação', cor: '#EF4444', icone: '🍔', ordem: 2 },
  { id: 'transporte',  nome: 'Transporte',  cor: '#F59E0B', icone: '🚗', ordem: 3 },
  { id: 'saude',       nome: 'Saúde',       cor: '#10B981', icone: '💊', ordem: 4 },
  { id: 'educacao',    nome: 'Educação',    cor: '#3B82F6', icone: '📚', ordem: 5 },
  { id: 'lazer',       nome: 'Lazer',       cor: '#EC4899', icone: '🎮', ordem: 6 },
  { id: 'trabalho',    nome: 'Trabalho',    cor: '#8B5CF6', icone: '💼', ordem: 7 },
  { id: 'assinaturas', nome: 'Assinaturas', cor: '#06B6D4', icone: '📱', ordem: 8 },
  { id: 'outros',      nome: 'Outros',      cor: '#6B7280', icone: '📦', ordem: 9 },
];

async function main() {
  console.log('🌱 Populando banco de dados...');

  // Config padrão
  await prisma.config.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main', tema: 'dark', moeda: 'BRL', nomeUsuario: 'Usuário', saldoInicial: 0 },
  });
  console.log('✓ Config criada');

  // Categorias padrão
  for (const cat of categoriasDefault) {
    await prisma.categoria.upsert({
      where: { id: cat.id },
      update: {},
      create: cat,
    });
  }
  console.log(`✓ ${categoriasDefault.length} categorias criadas`);

  console.log('\n✅ Banco pronto! Rode: npm start');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
