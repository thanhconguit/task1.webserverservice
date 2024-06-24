
using System.Linq.Expressions;
using WebServerService.Domain.Enum;
using WebServerService.Domain.Model;

namespace WebServerService.Data.Interface
{
    public interface IBaseRepository<T> where T : IEntity
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<PaginatedResult<T>> GetAllAsync(AdvancedQuery query);
        Task<T> GetByIdAsync(Guid id);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(Guid id);
    }
}
