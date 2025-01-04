using System.Linq.Expressions;
namespace Server.Application.Repository;

public interface IRepository<TEntity> where TEntity : class
{
    Task<TEntity> GetByIdAsync(Guid id);
    Task<IEnumerable<TEntity>> GetAllAsync();
    Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate);
    Task AddAsync(TEntity entity);
    Task AddManyAsync(IEnumerable<TEntity> entities);
    Task UpdateAsync(TEntity entity);
    Task DeleteAsync(TEntity entity);
    // Task DeleteManyAsync(IEnumerable<TEntity> entities);
}