using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using taxi_api.Seeder; // Thêm namespace cho SeederAdmin
using System.Text;
using taxi_api.Models;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình DbContext
builder.Services.AddDbContext<TaxiContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.")));

// Cấu hình PasswordHasher cho Driver và Admin
builder.Services.AddScoped<IPasswordHasher<Driver>, PasswordHasher<Driver>>();
builder.Services.AddScoped<IPasswordHasher<Admin>, PasswordHasher<Admin>>();

builder.Services.AddMemoryCache();

// Cấu hình JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// Thêm dịch vụ cho Controller
builder.Services.AddControllers();

// Cấu hình Swagger cho API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware trong quá trình phát triển
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Sử dụng HTTPS
app.UseHttpsRedirection();

// Kích hoạt xác thực JWT
app.UseAuthentication(); // Thêm xác thực JWT vào middleware pipeline
app.UseAuthorization();

// Ánh xạ các controller
app.MapControllers();

// Chạy SeederAdmin để seed dữ liệu admin nếu chưa có
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    SeederAdmin.Initialize(services);  // Thêm SeederAdmin để chạy seed dữ liệu
}

app.Run();
