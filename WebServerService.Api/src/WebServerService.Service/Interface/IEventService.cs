using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebServerService.Domain.Model;
using WebServerService.Service.Events.Dto;

namespace WebServerService.Service.Interface
{
    public interface IEventService
    {
        Task<EventsDto> GetEventsAsync(AdvancedQuery query);
        Task SetEventProcessedAsync(Guid eventId);
    }
}
