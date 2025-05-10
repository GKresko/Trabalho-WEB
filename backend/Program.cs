using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configuração de serviços
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<Banco>(options =>
    options.UseMySql("server=localhost;port=3306;database=planner;user=root;password=root",
    new MySqlServerVersion(new Version(8, 0, 33))));

var app = builder.Build();

// HABILITA O CORS AQUI
app.UseCors("PermitirTudo");

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

// Rotas e APIs
app.MapGet("/", () => "Loja da UP");
app.MapLivroApi();
app.MapPedidoApi();
app.MapAutorApi();
app.MapPagamentoApi();

app.Run();