using BolsaEmpleoBAC.BL.DTO;
using BolsaEmpleoBAC.BL.Interface;
using BolsaEmpleoBAC.General.Constantes;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;

namespace BolsaEmpleoBAC.BL.Logic
{
    public abstract class MasterManager<TEntity, TDbContext>
           where TEntity : class
           where TDbContext : DbContext,
           new()
    {
        private TDbContext DbContext = new TDbContext();

        public MasterManager()
        {
            DbContext.Configuration.ProxyCreationEnabled = false;
            DbContext.Configuration.LazyLoadingEnabled = false;
        }

        public TDbContext GetContext()
        {
            return DbContext;
        }

        public virtual TEntity Get(int id)
        {

            var result = DbContext.Set<TEntity>().Find(id);
            
            return result;
        }

        public virtual List<TEntity> Get()
        {

            string Table = typeof(TEntity).Name;

            string sql = "select * from " + Table + " with(nolock) where Borrado = 0";

            return DbContext.Database.SqlQuery<TEntity>(sql).ToList();

            //List<TEntity> resultList = DbContext.Set<TEntity>().ToList();
            //return resultList;

        }

        public virtual List<TEntity> Get(MasterFilter<TEntity> filtro)
        {
            List<TEntity> resultList = DbContext.Set<TEntity>().Where(filtro.LimitFilter()).ToList();

            return resultList;

        }

        public virtual DTOGridView<TEntity> GetPagedData(int page, int pageSize)
        {
            var resultList = DbContext.Set<TEntity>().OrderBy(x => "1").Skip(page * pageSize).Take(pageSize).ToList();

            var totalRows = DbContext.Set<TEntity>().Count();

            return new DTOGridView<TEntity> { Data = resultList, TotalRows = totalRows };

        }



        public virtual void Save(TEntity entity, int id)
        {
            try
            {
                var entityR = DbContext.Set<TEntity>().Find(id);

                if (entityR == null)
                {
                    DbContext.Set<TEntity>().Add(entity);
                }
                else
                {
                    //entityR = entity;
                    DbContext.Entry<TEntity>(entityR).CurrentValues.SetValues(entity);//.State = EntityState.Modified;
                }

                DbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        /*
        public abstract bool Save(TEntityModel entityModel, out TEntityModel entityReturn)
        {
            entityReturn = default(TEntityModel);
            try
            {

                var entity = MapperConfig().Map<TEntityModel, TEntity>(entityModel);
                DbContext.Set<TEntity>().Add(entity);
                DbContext.SaveChanges();

                entityReturn = Mapper.Map(entity, entityReturn);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public abstract bool Edit(int id, TEntityModel entityModel)
        {
            try
            {
                var entity = DbContext.Set<TEntity>().Find(id);
                if (entity == null)
                {
                    return false;
                }
                var entityUpdated = MapperConfig().Map(entityModel, entity);

                DbContext.Entry(entityUpdated).State = EntityState.Modified;
                DbContext.SaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }*/

        public virtual void Delete(int id)
        {
            try
            {
                var entity = DbContext.Set<TEntity>().Find(id);
                if (entity == null)
                {
                    throw new Exception(MensajesRespuesta.ElementoNoEncontrado);
                }
                DbContext.Set<TEntity>().Remove(entity);
                DbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }
    }
}
