using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Repository;

var builder = WebApplication.CreateBuilder(args);
builder.Services
    .AddDbContext<ApplicationDbContext>(
        options => options.UseNpgsql("Host=127.0.0.1;Username=graphql_workshop;Password=secret"));

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
