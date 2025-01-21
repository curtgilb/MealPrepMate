using System.Linq.Expressions;
using Server.Domain;
namespace Server.Application.Abstractions.Repository;

public interface IRepository<TEntity> where TEntity : Entity
{
    Task<TEntity?> GetById(Guid id);
    Task<IEnumerable<TEntity>> GetAll();
    Task Add(TEntity entity);
    Task AddMany(IEnumerable<TEntity> entities);
    Task Update(TEntity entity);
    Task Delete(TEntity entity);
    Task DeleteMany(IEnumerable<TEntity> entities);
}