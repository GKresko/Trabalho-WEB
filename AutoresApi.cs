using Microsoft.EntityFrameworkCore;

public static class AutoresApi
{
    public static void MapAutorApi(this WebApplication app)
    {
        // Endpoint GET para listar todos os autores de forma assíncrona
        app.MapGet("/autores", async (Banco db) =>
            await db.Autores.ToListAsync());

        // Endpoint GET para buscar por ID
        app.MapGet("/autores/{id}", async (int id, Banco db) =>
            await db.Autores.FindAsync(id) is Autor autor
                ? Results.Ok(autor)
                : Results.NotFound());

        // Endpoint POST para criar um novo autor (recebendo o objeto do corpo da requisição)
        app.MapPost("/autores", async (Autor autor, Banco db) => {
            db.Autores.Add(autor);
            await db.SaveChangesAsync();
            return Results.Created($"/autores/{autor.Id}", autor);
        });

        // Endpoint PUT para atualizar um autor
        app.MapPut("/autores/{id}", async (int id, Autor autorAlterado, Banco db) =>
        {
            var autor = await db.Autores.FindAsync(id);
            if (autor is null) return Results.NotFound();

            autor.Nome = autorAlterado.Nome;
            autor.Obra = autorAlterado.Obra;

            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        // Endpoint DELETE para deletar um autor
        app.MapDelete("/autores/{id}", async (int id, Banco db) =>
        {
            if (await db.Autores.FindAsync(id) is Autor autor)
            {
                db.Autores.Remove(autor);
                await db.SaveChangesAsync();
                return Results.NoContent();
            }
            return Results.NotFound();
        });
    }
}
