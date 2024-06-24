using WebServerService.Domain.Enum;

namespace WebServerService.Domain.Model
{
    public class AdvancedQuery
    {
        public int PageIndex { get; set; }

        public int PageSize { get; set; }

        public string? SortedField { get; set; }

        public SortType? SortedType { get; set; }

        public IEnumerable<FilterCriterion>? Filters { get; set; }
    }
}
