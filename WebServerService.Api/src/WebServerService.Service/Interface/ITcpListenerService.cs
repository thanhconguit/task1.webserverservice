using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace WebServerService.Service.Interface
{
    public interface ITcpListenerService
    {
        Task ProcessEventAsync(TcpClient client);
        Task EventListeningAsync(CancellationToken cancellationToken);
    }
}
