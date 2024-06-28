using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Sockets;
using System.Text;
using WebServerService.Data.Interface;
using WebServerService.Data.Model;
using WebServerService.Service.Interface;
using WebServerService.Service.Notification;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;

namespace WebServerService.Service.Tcp
{
    public class TcpListenerService : ITcpListenerService
    {
        private readonly int _port;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<TcpListenerService> _logger;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IConfiguration _configuration;

        public TcpListenerService(int port,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<TcpListenerService> logger,
            IHubContext<NotificationHub> hubContext,
            IConfiguration configuration)
        {
            _port = port;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
            _hubContext = hubContext;
            _configuration = configuration;
        }

        public async Task EventListeningAsync(CancellationToken cancellationToken)
        {
            var tcpListener = new TcpListener(IPAddress.Any, _port);
            tcpListener.Start();
            _logger.LogInformation($"TCP Listener started on port {_port}.");

            while (!cancellationToken.IsCancellationRequested)
            {
                var client = await tcpListener.AcceptTcpClientAsync();

                var whiteListedIp = _configuration.GetSection("WhiteListedIp").Get<string[]>();

                string clientIP = ((IPEndPoint)client.Client.RemoteEndPoint).Address.ToString();

                if (whiteListedIp != null && whiteListedIp.Any() && whiteListedIp.Contains(clientIP))
                {
                    _ = Task.Run(() => ProcessEventAsync(client));
                }
                else
                {
                    _logger.LogWarning($"{clientIP} is not allowed to send events");
                }
            }
        }

        public async Task ProcessEventAsync(TcpClient client)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var buffer = new byte[1024];
                var stream = client.GetStream();
                var bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);
                var eventData = Encoding.UTF8.GetString(buffer, 0, bytesRead);

                var _eventRepository = scope.ServiceProvider.GetRequiredService<IEventRepository>();

                // Store event in MongoDB
                var newEvent = JsonConvert.DeserializeObject<Event>(eventData);

                if (newEvent != null)
                {
                    await _eventRepository.AddAsync(newEvent);

                    await _hubContext.Clients.All.SendAsync("ReceiveNotification", newEvent);

                    _logger.LogInformation($"Received and stored event: {eventData}");
                }
            }
        }
    }
}
