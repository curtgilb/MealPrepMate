using Server.Application.Abstractions.Repository;
namespace Server.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Server.Domain;

public class UnitOfWork : IUnitOfWork
{
    private readonly DbContext _context;
    private readonly Dictionary<Type, object> _repositories;
    private bool _disposed;

    public UnitOfWork(DbContext context)
    {
        _context = context;
        _repositories = new Dictionary<Type, object>();
    }

    public IRepository<TEntity> Repository<TEntity>() where TEntity : Entity
    {
        var type = typeof(TEntity);
        if (!_repositories.ContainsKey(type))
        {
            _repositories[type] = new Repository<TEntity>(_context);
        }

        return (IRepository<TEntity>)_repositories[type];
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed && disposing)
        {
            _context.Dispose();
        }
        _disposed = true;
    }
}