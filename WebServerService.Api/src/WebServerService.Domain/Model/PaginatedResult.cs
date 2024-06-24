using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServerService.Domain.Model
{
    public class PaginatedResult<T> : BaseResult
    {
        public IEnumerable<T> Items { get; set; }
    }

}
