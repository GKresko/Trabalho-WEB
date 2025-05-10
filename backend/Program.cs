using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo", policy =>
    {
        policy.AllowAnyOrigin()      // Permite qualquer origem
              .AllowAnyMethod()      // Permite qualquer método HTTP
              .AllowAnyHeader();     // Permite qualquer cabeçalho
    });
});

// Configuração de serviços
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure o serviço do DbContext para usar MySQL
builder.Services.AddDbContext<Banco>(options =>
    options.UseMySql("server=localhost;port=3306;database=planner;user=root;password=root",    
    new MySqlServerVersion(new Version(8, 0, 33))));

var app = builder.Build();

// Rotas e APIs
app.MapGet("/", () => "Loja da UP");
app.MapLivroApi();
app.MapPedidoApi();
app.MapAutorApi();
app.MapPagamentoApi();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();


app.Run();