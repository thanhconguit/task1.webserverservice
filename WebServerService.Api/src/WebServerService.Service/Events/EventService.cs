using Microsoft.AspNetCore.SignalR;
using WebServerService.Data.Interface;
using WebServerService.Domain.Model;
using WebServerService.Service.Events.Dto;
using WebServerService.Service.Interface;
using WebServerService.Service.Notification;

namespace WebServerService.Service.Events
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;

        public EventService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<EventsDto> GetEventsAsync(AdvancedQuery query)
        {
            var events = await _eventRepository.GetAllAsync(query);

            return new EventsDto
            {
                Events = events.Items.Select(x => new EventDto()
                {
                    Id = x.Id,
                    Data = x.Data,
                    Timestamp = x.Timestamp,
                    IsProcessed = x.IsProcessed,
                }),
                TotalRecords = events.TotalRecords
            };
        }

        public async Task SetEventProcessedAsync(Guid eventId)
        {
            var currentEvent = await _eventRepository.GetByIdAsync(eventId);

            if (currentEvent != null)
            {
                currentEvent.IsProcessed = true;
                await _eventRepository.UpdateAsync(currentEvent);
            }
        }
    }
}
