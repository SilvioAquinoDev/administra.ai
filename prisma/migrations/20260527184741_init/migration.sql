-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "trialEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "features" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "stripePriceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notas_fiscais" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "chave_acesso" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "serie" INTEGER NOT NULL DEFAULT 1,
    "data_emissao" TIMESTAMP(3) NOT NULL,
    "cnpj_emitente" TEXT NOT NULL,
    "nome_emitente" TEXT NOT NULL,
    "ie_emitente" TEXT,
    "endereco_emitente" TEXT,
    "valor_total" DECIMAL(10,2) NOT NULL,
    "cpf_consumidor" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "nota_fiscal_id" INTEGER,
    "chave_acesso" TEXT,
    "codigo" TEXT,
    "descricao" TEXT NOT NULL,
    "unidade" TEXT DEFAULT 'UN',
    "quantidade" DECIMAL(10,3),
    "valor_unitario" DECIMAL(10,2),
    "valor_total" DECIMAL(10,2),
    "fornecedor" TEXT,
    "data_compra" TIMESTAMP(3),
    "preco_venda" DECIMAL(10,2) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "nota_fiscal_id" INTEGER NOT NULL,
    "forma_pagamento" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livro_diario" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "conta" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "cliente_fornecedor" TEXT,
    "entrada" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "saida" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tipo" TEXT NOT NULL DEFAULT 'VENDA',
    "nota_fiscal_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "livro_diario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planejamento_config" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "dados" JSONB NOT NULL,
    "ano_referencia" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planejamento_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planejamento_faturamento" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "meta_diaria_almoco" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "meta_diaria_janta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dias_trabalhados" INTEGER NOT NULL DEFAULT 26,
    "lucroDesejado" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planejamento_faturamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planejamento_acompanhamento" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "faturamento_almoco" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "faturamento_janta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "faturamento_total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "observacao" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planejamento_acompanhamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fichas_tecnicas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "preco_venda" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "custo_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "custo_por_porcao" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "margem" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "rendimento_porcoes" INTEGER NOT NULL DEFAULT 1,
    "ingredientes" TEXT,
    "modo_preparo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fichas_tecnicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ficha_itens" (
    "id" TEXT NOT NULL,
    "ficha_id" TEXT NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidade" TEXT DEFAULT 'UN',
    "valor_unitario" DECIMAL(10,2),
    "custo" DECIMAL(10,2),
    "is_produto_acabado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ficha_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "despesas_fixas" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "despesas_fixas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "despesas_variaveis" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "percentual" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "despesas_variaveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "salario" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxas_cartao_config" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taxas_cartao_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provisoes_funcionarios" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "provisao" TEXT NOT NULL,
    "funcionario_nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provisoes_funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notas_fiscais_chave_acesso_key" ON "notas_fiscais"("chave_acesso");

-- CreateIndex
CREATE INDEX "notas_fiscais_userId_chave_acesso_idx" ON "notas_fiscais"("userId", "chave_acesso");

-- CreateIndex
CREATE INDEX "notas_fiscais_data_emissao_idx" ON "notas_fiscais"("data_emissao");

-- CreateIndex
CREATE INDEX "produtos_userId_descricao_idx" ON "produtos"("userId", "descricao");

-- CreateIndex
CREATE INDEX "pagamentos_userId_idx" ON "pagamentos"("userId");

-- CreateIndex
CREATE INDEX "livro_diario_userId_data_idx" ON "livro_diario"("userId", "data");

-- CreateIndex
CREATE INDEX "livro_diario_userId_conta_idx" ON "livro_diario"("userId", "conta");

-- CreateIndex
CREATE INDEX "livro_diario_userId_tipo_idx" ON "livro_diario"("userId", "tipo");

-- CreateIndex
CREATE INDEX "planejamento_config_userId_tipo_ano_referencia_idx" ON "planejamento_config"("userId", "tipo", "ano_referencia");

-- CreateIndex
CREATE UNIQUE INDEX "planejamento_config_userId_tipo_ano_referencia_key" ON "planejamento_config"("userId", "tipo", "ano_referencia");

-- CreateIndex
CREATE INDEX "planejamento_faturamento_userId_ano_mes_idx" ON "planejamento_faturamento"("userId", "ano", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "planejamento_faturamento_userId_ano_mes_key" ON "planejamento_faturamento"("userId", "ano", "mes");

-- CreateIndex
CREATE INDEX "planejamento_acompanhamento_userId_ano_mes_idx" ON "planejamento_acompanhamento"("userId", "ano", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "planejamento_acompanhamento_userId_ano_mes_key" ON "planejamento_acompanhamento"("userId", "ano", "mes");

-- CreateIndex
CREATE INDEX "fichas_tecnicas_userId_nome_idx" ON "fichas_tecnicas"("userId", "nome");

-- CreateIndex
CREATE INDEX "fichas_tecnicas_userId_categoria_idx" ON "fichas_tecnicas"("userId", "categoria");

-- CreateIndex
CREATE INDEX "ficha_itens_ficha_id_idx" ON "ficha_itens"("ficha_id");

-- CreateIndex
CREATE INDEX "ficha_itens_produto_id_idx" ON "ficha_itens"("produto_id");

-- CreateIndex
CREATE INDEX "despesas_fixas_userId_idx" ON "despesas_fixas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "despesas_fixas_userId_nome_key" ON "despesas_fixas"("userId", "nome");

-- CreateIndex
CREATE INDEX "despesas_variaveis_userId_idx" ON "despesas_variaveis"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "despesas_variaveis_userId_nome_key" ON "despesas_variaveis"("userId", "nome");

-- CreateIndex
CREATE INDEX "funcionarios_userId_idx" ON "funcionarios"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_userId_nome_key" ON "funcionarios"("userId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "taxas_cartao_config_userId_key" ON "taxas_cartao_config"("userId");

-- CreateIndex
CREATE INDEX "provisoes_funcionarios_userId_ano_provisao_idx" ON "provisoes_funcionarios"("userId", "ano", "provisao");

-- CreateIndex
CREATE UNIQUE INDEX "provisoes_funcionarios_userId_ano_provisao_funcionario_nome_key" ON "provisoes_funcionarios"("userId", "ano", "provisao", "funcionario_nome");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_nota_fiscal_id_fkey" FOREIGN KEY ("nota_fiscal_id") REFERENCES "notas_fiscais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_nota_fiscal_id_fkey" FOREIGN KEY ("nota_fiscal_id") REFERENCES "notas_fiscais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livro_diario" ADD CONSTRAINT "livro_diario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livro_diario" ADD CONSTRAINT "livro_diario_nota_fiscal_id_fkey" FOREIGN KEY ("nota_fiscal_id") REFERENCES "notas_fiscais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planejamento_config" ADD CONSTRAINT "planejamento_config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planejamento_faturamento" ADD CONSTRAINT "planejamento_faturamento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planejamento_acompanhamento" ADD CONSTRAINT "planejamento_acompanhamento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_tecnicas" ADD CONSTRAINT "fichas_tecnicas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ficha_itens" ADD CONSTRAINT "ficha_itens_ficha_id_fkey" FOREIGN KEY ("ficha_id") REFERENCES "fichas_tecnicas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ficha_itens" ADD CONSTRAINT "ficha_itens_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despesas_fixas" ADD CONSTRAINT "despesas_fixas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despesas_variaveis" ADD CONSTRAINT "despesas_variaveis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxas_cartao_config" ADD CONSTRAINT "taxas_cartao_config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provisoes_funcionarios" ADD CONSTRAINT "provisoes_funcionarios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
