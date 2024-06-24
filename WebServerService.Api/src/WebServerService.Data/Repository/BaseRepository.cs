using MongoDB.Bson;
using MongoDB.Driver;
using System.Linq.Expressions;
using WebServerService.Data.Interface;
using WebServerService.Domain.Enum;
using WebServerService.Domain.Model;
using WebServerService.Domain.Utility;

namespace WebServerService.Data.Repository
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class, IEntity
    {
        private readonly IMongoCollection<T> _collection;

        public BaseRepository(IMongoDatabase database, string collectionName)
        {
            _collection = database.GetCollection<T>(collectionName);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            var entities = await _collection.Find(Builders<T>.Filter.Empty).ToListAsync();
            return entities;
        }

        public async Task<PaginatedResult<T>> GetAllAsync(AdvancedQuery query)
        {
            var predicate = ExpressionBuilder.BuildFilter<T>(query.Filters);

            var filter = Builders<T>.Filter.Where(predicate);

            var totalRecords = await _collection.CountDocumentsAsync(filter);

            var sortDefinition = BuildSortDefinition(query.SortedField, query.SortedType);

            var items = await _collection.Find(filter)
                                         .Sort(sortDefinition)
                                         .Skip((query.PageIndex - 1) * query.PageSize)
                                         .Limit(query.PageSize)
                                         .ToListAsync();

            return new PaginatedResult<T>
            {
                TotalRecords = (int)totalRecords,
                Items = items
            };

        }
        public async Task<T> GetByIdAsync(Guid id)
        {
            return await _collection.Find(Builders<T>.Filter.Eq(e => e.Id, id)).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            var entities = await _collection.Find(predicate).ToListAsync();
            return entities;
        }

        public async Task AddAsync(T entity)
        {
            await _collection.InsertOneAsync(entity);
        }

        public async Task UpdateAsync(T entity)
        {
            await _collection.ReplaceOneAsync(Builders<T>.Filter.Eq(e => e.Id, entity.Id), entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _collection.DeleteOneAsync(Builders<T>.Filter.Eq(e => e.Id, id));
        }

        private SortDefinition<T> BuildSortDefinition(string? sortField, SortType? sortOrder = SortType.Ascending)
        {
            var sortDefinitionBuilder = Builders<T>.Sort;
            SortDefinition<T> sortDefinition = null;
            if (string.IsNullOrEmpty(sortField)) return sortDefinition;

            switch (sortOrder)
            {
                case SortType.Ascending:
                    sortDefinition = sortDefinitionBuilder.Ascending(sortField);
                    break;
                case SortType.Descending:
                    sortDefinition = sortDefinitionBuilder.Descending(sortField);
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(sortOrder), sortOrder, "Unsupported sort order.");
            }

            return sortDefinition;
        }

    }
}
