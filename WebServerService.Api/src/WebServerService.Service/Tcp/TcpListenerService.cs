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

namespace WebServerService.Service.Tcp
{
    public class TcpListenerService : ITcpListenerService
    {
        private readonly int _port;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<TcpListenerService> _logger;
        private readonly IHubContext<NotificationHub> _hubContext;

        public TcpListenerService(int port, 
            IServiceScopeFactory serviceScopeFactory, 
            ILogger<TcpListenerService> logger,
            IHubContext<NotificationHub> hubContext)
        {
            _port = port;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
            _hubContext = hubContext;
        }

        public async Task EventListeningAsync(CancellationToken cancellationToken)
        {
            var tcpListener = new TcpListener(IPAddress.Any, _port);
            tcpListener.Start();
           _logger.LogInformation($"TCP Listener started on port {_port}.");

            while (!cancellationToken.IsCancellationRequested)
            {
                var client = await tcpListener.AcceptTcpClientAsync();
                _ = Task.Run(() => ProcessEventAsync(client));
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
                var newEvent = new Event
                {
                    Id = Guid.NewGuid(),
                    Data = eventData,
                    Timestamp = DateTime.UtcNow,
                    IsProcessed = false
                };
                await _eventRepository.AddAsync(newEvent);

                await _hubContext.Clients.All.SendAsync("ReceiveNotification", newEvent.Id, newEvent);

                _logger.LogInformation($"Received and stored event: {eventData}");
            }
        }
    }
}
