namespace Server.Application.Repository;

public interface IUnitOfWork : IDisposable
{
    IRepository<TEntity> Repository<TEntity>() where TEntity : class;
    Task<int> SaveChangesAsync();
}