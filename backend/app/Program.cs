using Npgsql;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using App.Models;
using Microsoft.EntityFrameworkCore;
DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);
var db_password = Environment.GetEnvironmentVariable("DB_PASSWORD");
builder.Services.AddDbContext<ApplicationDb>(options => options.UseNpgsql($"Host=localhost;Username=postgres;Password={db_password}"));

builder.Services
    .AddGraphQLServer()
    .AddTypes();
// .AddInstrumentation();

// builder.Logging.AddOpenTelemetry(
//     options =>
//     {
//         options.IncludeFormattedMessage = true;
//         options.IncludeScopes = true;
//         options.ParseStateValues = true;
//         options.SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("App"));
//     });

// builder.Services
//     .AddOpenTelemetry()
//     .WithTracing(
//       b =>
//       {
//           b.AddHttpClientInstrumentation();
//           b.AddAspNetCoreInstrumentation();
//           b.AddHotChocolateInstrumentation();
//           b.AddNpgsql();
//           b.AddJaegerExporter(options =>
//           {
//               options.AgentHost = "localhost";
//               options.AgentPort = 6831;
//           });
//       });



var app = builder.Build();

app.MapGraphQL();

await app.RunWithGraphQLCommandsAsync(args);