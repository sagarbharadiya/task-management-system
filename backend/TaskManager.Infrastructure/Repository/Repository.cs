using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TaskManager.Core.Interfaces;
using TaskManager.Infrastructure.Context;

namespace TaskManager.Infrastructure.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly TaskManagerDBContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(TaskManagerDBContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();
        public async Task<T?> GetByIdAsync(Guid id) => await _dbSet.FindAsync(id);
        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
            => await _dbSet.Where(predicate).ToListAsync();
        public IQueryable<T> GetQueryable() => _dbSet.AsQueryable();
        public async Task<IEnumerable<T>> GetFilteredAsync(Expression<Func<T, bool>> predicate)
            => await _dbSet.Where(predicate).ToListAsync();
        public async Task<T?> GetFirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
            => await _dbSet.FirstOrDefaultAsync(predicate);
        public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
            => await _dbSet.AnyAsync(predicate);
        public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);
        public async Task UpdateAsync(T entity) => _dbSet.Update(entity);
        public async Task DeleteAsync(Guid id)
        {
            var entity = await _dbSet.FindAsync(id); // fetch the entity by id
            if (entity != null)
            {
                _dbSet.Remove(entity); // remove if found
            }
        }
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
