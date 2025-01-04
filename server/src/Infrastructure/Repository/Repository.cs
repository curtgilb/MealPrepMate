using System.Linq.Expressions;
using Server.Application.Repository;
using Microsoft.EntityFrameworkCore;
namespace Server.Infrastructure.Repository;


public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
{
    protected readonly DbContext Context;
    protected readonly DbSet<TEntity> DbSet;

    public Repository(DbContext context)
    {
        Context = context;
        DbSet = context.Set<TEntity>();
    }

    public virtual async Task<TEntity> GetByIdAsync(Guid id)
    {
        return await DbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
    {
        return await DbSet.ToListAsync();
    }

    public virtual async Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate)
    {
        return await DbSet.Where(predicate).ToListAsync();
    }

    public virtual async Task AddAsync(TEntity entity)
    {
        await DbSet.AddAsync(entity);
    }

    public virtual async Task AddManyAsync(IEnumerable<TEntity> entities)
    {
        await DbSet.AddRangeAsync(entities);
    }

    public virtual Task UpdateAsync(TEntity entity)
    {
        DbSet.Update(entity);
        return Task.CompletedTask;
    }

    public virtual Task DeleteAsync(TEntity entity)
    {
        DbSet.Remove(entity);
        return Task.CompletedTask;
    }
}
