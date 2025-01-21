using Server.Domain;

namespace Server.Application.Abstractions.Repository;

public interface IUnitOfWork : IDisposable
{
    IRepository<TEntity> Repository<TEntity>() where TEntity : Entity;
    Task<int> SaveChangesAsync();
}