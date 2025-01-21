using Server.Application.Abstractions.Repository;
using Microsoft.EntityFrameworkCore;
using Server.Domain;

namespace Server.Infrastructure.Repository;

public class Repository<TEntity> : IRepository<TEntity> where TEntity : Entity
{
    protected readonly DbContext Context;
    protected readonly DbSet<TEntity> DbSet;

    public Repository(DbContext context)
    {
        Context = context;
        DbSet = context.Set<TEntity>();
    }

    public virtual async Task<TEntity?> GetById(Guid id)
    {
        return await DbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<TEntity>> GetAll()
    {
        return await DbSet.ToListAsync();
    }

    public virtual async Task Add(TEntity entity)
    {
        await DbSet.AddAsync(entity);
    }

    public virtual async Task AddMany(IEnumerable<TEntity> entities)
    {
        await DbSet.AddRangeAsync(entities);
    }

    public virtual Task Update(TEntity entity)
    {
        DbSet.Update(entity);
        return Task.CompletedTask;
    }

    public virtual Task Delete(TEntity entity)
    {
        DbSet.Remove(entity);
        return Task.CompletedTask;
    }

    public virtual Task DeleteMany(IEnumerable<TEntity> entities)
    {
        DbSet.RemoveRange(entities);
        return Task.CompletedTask;
    }
}
