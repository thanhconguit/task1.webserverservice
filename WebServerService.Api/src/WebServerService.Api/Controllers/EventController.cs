using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServerService.Domain.Const;
using WebServerService.Domain.Model;
using WebServerService.Service.Interface;

namespace WebServerService.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;
      
        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetEventsAsync([FromQuery] AdvancedQuery query)
        {
            return Ok(await _eventService.GetEventsAsync(query));
        }

        [HttpPut("{eventId}/processed")]
        [Authorize(Roles = RoleConstants.Admin + "," + RoleConstants.Contributor)]
        public async Task<IActionResult> SetEventProcessedAsync(Guid eventId)
        {
            await _eventService.SetEventProcessedAsync(eventId);
            return Ok();
        }
    }
}
