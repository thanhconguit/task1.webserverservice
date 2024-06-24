using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text;
using WebServerService.Data;
using WebServerService.Data.Interface;
using WebServerService.Data.Model;
using WebServerService.Data.Repository;
using WebServerService.Domain.Const;
using WebServerService.Service;
using WebServerService.Service.Authorization;
using WebServerService.Service.Interface;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

#region Configure MongoDB settings
builder.Services.Configure<MongoDbSettings>(configuration.GetSection("MongoDbSettings"));

var mongoDbSettings = configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
var mongoClient = new MongoClient(mongoDbSettings.ConnectionString);
BsonDefaults.GuidRepresentation = GuidRepresentation.Standard; // Set Guid representation here
var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.DatabaseName);

builder.Services.AddSingleton(mongoDatabase);
#endregion

#region Configure Identity
builder.Services.AddIdentity<User, Role>()
    .AddMongoDbStores<User, Role, Guid>
    (
        mongoDbSettings.ConnectionString, mongoDbSettings.DatabaseName
    )
    .AddDefaultTokenProviders();

#endregion

#region Register Services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRoleService, RoleService>();

#endregion

#region Configure JWT authentication

var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"]);

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
        ValidIssuer = configuration["Jwt:Issuer"],
        ValidAudience = configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" // Add this line
    };
});

builder.Services.AddControllers();
#endregion

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

#region Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "AuthWithMongo", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
#endregion

#region Add Predefined Roles & User admin
using (var scope = builder.Services.BuildServiceProvider().CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();
    var userManger = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

    var predefinedRoles = configuration.GetSection("PredefinedRoles").Get<string[]>();

    foreach (var roleName in predefinedRoles)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(new Role { Id = Guid.NewGuid(), Name = roleName });
        }
    }

    var adminUser = new User
    {
        UserName = configuration.GetSection("DefaultAdminUser:UserName").Get<string>(),
        Email = configuration.GetSection("DefaultAdminUser:Email").Get<string>(),
    };

    var results = await userManger.CreateAsync(adminUser, password: configuration.GetSection("DefaultAdminUser:Password").Get<string>());

    if (results.Succeeded)
    {
        await userManger.AddToRoleAsync(adminUser, RoleConstants.Admin);
    }

}
#endregion

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AuthWithMongo v1");
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();