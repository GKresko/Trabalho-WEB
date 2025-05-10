using Microsoft.EntityFrameworkCore;

public static class LivroApi{

public static void MapLivroApi(this WebApplication app)
{

// Endpoint GET para listar todos os livros de forma assíncrona
app.MapGet("/livros", async (Banco db) =>
    await db.Livros.ToListAsync());

// Endpoint GET para buscar por ID
app.MapGet("/livros/{id}", async (int id, Banco db) =>
    await db.Livros.FindAsync(id) is Livro livro
        ? Results.Ok(livro)
        : Results.NotFound());

// Endpoint POST para criar um novo livro (recebendo o objeto do corpo da requisição)
app.MapPost("/livros", async (Livro livro, Banco db) => {
    db.Livros.Add(livro);
    await db.SaveChangesAsync();
    return Results.Created($"/livros/{livro.Id}", livro);
});

// Endpoint PUT para atualizar um livro
app.MapPut("/livros/{id}", async (int id, Livro livroAlterado, Banco db) =>
{
    var livro = await db.Livros.FindAsync(id);
    if (livro is null) return Results.NotFound();

    livro.Nome = livroAlterado.Nome;
    livro.Autor = livroAlterado.Autor;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

// Endpoint DELETE para deletar um livro
app.MapDelete("/livros/{id}", async (int id, Banco db) =>
{
    if (await db.Livros.FindAsync(id) is Livro livro)
    {
        db.Livros.Remove(livro);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});
}
}