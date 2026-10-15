# Kit UI — card de indicador acessível

Referências autorizadas: `frontEnds/library/dashboard-kit`, `frontEnds/library/feedback-kit`, `frontEnds/library/navigation-kit` e `frontEnds/library/motion-kit` (repositório **privado**, acesso somente por permissão). O componente publicado aqui é **novo e independente**, não uma cópia dessas fontes, com estilo violeta próprio e sem Tailwind.

1. Conclua o checkpoint v0.2. Copie `StatusCard.tsx` e `status-card.css` para `src/components/` do seu Meu Gestor e importe o CSS no App.
2. Substitua o card simples por `<StatusCard title="OS concluídas" value={orders.filter(o=>o.status==='concluído').length} description="Origem: ordens carregadas" />`.
3. Teste contagens antes/depois de avançar uma OS. Um contador não pode mudar sem alteração na lista de dados.
4. Navegue com zoom e teclado e verifique contraste em 360 px. Respeite preferências de movimento reduzido.

**Limite:** card de apresentação, não fornece persistência, autenticação nem ferramenta de dashboard completa. O DevKitTools DKT-UI-003 cataloga a parte funcional `artisys-dashboard`, não é uma cópia da UI privada nem ZIP automaticamente disponível.
