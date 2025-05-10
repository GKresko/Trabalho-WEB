using Microsoft.EntityFrameworkCore;

public static class PagamentoApi
{
    public static void MapPagamentoApi(this WebApplication app)
    {
        // Endpoint GET para listar todos os pagamentos de forma assíncrona
        app.MapGet("/pagamentos", async (Banco db) =>
            await db.Pagamentos.ToListAsync());

        // Endpoint GET para buscar um pagamento por ID
        app.MapGet("/pagamentos/{id}", async (int id, Banco db) =>
            await db.Pagamentos.FindAsync(id) is Pagamentos pagamento
                ? Results.Ok(pagamento)
                : Results.NotFound());

        // Endpoint POST para criar um novo pagamento
        app.MapPost("/pagamentos", async (Pagamentos pagamento, Banco db) => {
            db.Pagamentos.Add(pagamento);
            await db.SaveChangesAsync();
            return Results.Created($"/pagamentos/{pagamento.Id}", pagamento);
        });

        // Endpoint PUT para atualizar um pagamento
        app.MapPut("/pagamentos/{id}", async (int id, Pagamentos pagamentoAlterado, Banco db) =>
        {
            var pagamento = await db.Pagamentos.FindAsync(id);
            if (pagamento is null) return Results.NotFound();

            pagamento.Cartao = pagamentoAlterado.Cartao;
            pagamento.Dinheiro = pagamentoAlterado.Dinheiro;

            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        // Endpoint DELETE para deletar um pagamento
        app.MapDelete("/pagamentos/{id}", async (int id, Banco db) =>
        {
            if (await db.Pagamentos.FindAsync(id) is Pagamentos pagamento)
            {
                db.Pagamentos.Remove(pagamento);
                await db.SaveChangesAsync();
                return Results.NoContent();
            }
            return Results.NotFound();
        });
    }
}
