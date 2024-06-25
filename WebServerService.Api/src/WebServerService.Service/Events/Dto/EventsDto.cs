using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebServerService.Domain.Model;

namespace WebServerService.Service.Events.Dto
{
    public class EventsDto : BaseResult
    {
        public IEnumerable<EventDto> Events { get; set; }
    }
    public class EventDto
    {
        public Guid Id { get; set; }

        public string Data { get; set; }

        public DateTime Timestamp { get; set; }

        public bool IsProcessed { get; set; }
    }
}
