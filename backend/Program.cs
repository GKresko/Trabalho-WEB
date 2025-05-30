using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Banco de Dados
builder.Services.AddDbContext<Banco>(options =>
    options.UseMySql(
        "server=localhost;port=3306;database=planner;user=root;password=root",
        new MySqlServerVersion(new Version(8, 0, 33))
    )
);

var app = builder.Build();

// Middleware
app.UseCors("PermitirTudo");
app.UseSwagger();
app.UseSwaggerUI();

// Rotas
app.MapGet("/", () => "Loja da UP");
app.MapLivroApi();
app.MapPedidoApi();
app.MapAutorApi();
app.MapPagamentoApi();

app.Run();
