using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using System.Text;
using System.Text.Json.Serialization;
using TravelPoints.Models.Entites.TravelPoints;
using TravelPoints.Models.Entites.Users;
using TravelPoints.Services.AuthServices;
using TravelPoints.Services.MailService;
using TravelPoints.Services.NotificationService;
using TravelPoints.Services.TravelPointService;
using TravelPoints.Services.UserService;

namespace TravelPoints
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AuthService.secret)),
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                };
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
            });

            services.AddControllers();
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
            services.AddEndpointsApiExplorer();
            services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Travel Points Api", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string [] {}
                    }
                });
            });

            ConfigureDatabaseCollections(services);
            ConfigureInterfaces(services);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // if (env.IsDevelopment())
            // {
            app.UseSwagger();
            app.UseSwaggerUI();
            // }
            app.UseCors("AllowAll");
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public void ConfigureDatabaseCollections(IServiceCollection services)
        {
            var mongoClient = new MongoClient(Configuration["ConnectionStrings:MongoDB"]);
            var database = mongoClient.GetDatabase(Configuration["ConnectionStrings:DatabaseName"]);
            services.AddSingleton<IMongoDatabase>(database);
            services.AddSingleton<IMongoCollection<User>>(database.GetCollection<User>("Users"));
            services.AddSingleton<IMongoCollection<Point>>(database.GetCollection<Point>("Points"));
        }

        public void ConfigureInterfaces(IServiceCollection services)
        {
            services.AddScoped<ITravelPointsService, TravelPointsService>();
            services.AddTransient<IAuthService, AuthService>();
            services.AddTransient<IEmailTemplateService, EmailTemplateService>();
            services.AddSingleton<IMailSenderService, MailSenderService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<INotificationService, NotificationService>();
        }
    }
}