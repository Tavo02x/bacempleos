using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using BolsaEmpleoBAC.Entities;

namespace BolsaEmpleoBAC.WebAPI.Controllers.OData
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using BolsaEmpleoBAC.Entities;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<vw_ListaPostulanteReporte>("vw_ListaPostulanteReporte");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [Authorize]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class vw_ListaPostulanteReporteController : ODataController
    {
        private BACEntities db = new BACEntities();

        // GET: odata/vw_ListaPostulanteReporte
        [EnableQuery]
        public IQueryable<vw_ListaPostulanteReporte> Getvw_ListaPostulanteReporte()
        {
            return db.vw_ListaPostulanteReporte;
        }

        // GET: odata/vw_ListaPostulanteReporte(5)
        [EnableQuery]
        public SingleResult<vw_ListaPostulanteReporte> Getvw_ListaPostulanteReporte([FromODataUri] string key)
        {
            return SingleResult.Create(db.vw_ListaPostulanteReporte.Where(vw_ListaPostulanteReporte => vw_ListaPostulanteReporte.NombreCompleto == key));
        }

        // PUT: odata/vw_ListaPostulanteReporte(5)
        public IHttpActionResult Put([FromODataUri] string key, Delta<vw_ListaPostulanteReporte> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            vw_ListaPostulanteReporte vw_ListaPostulanteReporte = db.vw_ListaPostulanteReporte.Find(key);
            if (vw_ListaPostulanteReporte == null)
            {
                return NotFound();
            }

            patch.Put(vw_ListaPostulanteReporte);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!vw_ListaPostulanteReporteExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(vw_ListaPostulanteReporte);
        }

        // POST: odata/vw_ListaPostulanteReporte
        public IHttpActionResult Post(vw_ListaPostulanteReporte vw_ListaPostulanteReporte)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.vw_ListaPostulanteReporte.Add(vw_ListaPostulanteReporte);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (vw_ListaPostulanteReporteExists(vw_ListaPostulanteReporte.NombreCompleto))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(vw_ListaPostulanteReporte);
        }

        // PATCH: odata/vw_ListaPostulanteReporte(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] string key, Delta<vw_ListaPostulanteReporte> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            vw_ListaPostulanteReporte vw_ListaPostulanteReporte = db.vw_ListaPostulanteReporte.Find(key);
            if (vw_ListaPostulanteReporte == null)
            {
                return NotFound();
            }

            patch.Patch(vw_ListaPostulanteReporte);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!vw_ListaPostulanteReporteExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(vw_ListaPostulanteReporte);
        }

        // DELETE: odata/vw_ListaPostulanteReporte(5)
        public IHttpActionResult Delete([FromODataUri] string key)
        {
            vw_ListaPostulanteReporte vw_ListaPostulanteReporte = db.vw_ListaPostulanteReporte.Find(key);
            if (vw_ListaPostulanteReporte == null)
            {
                return NotFound();
            }

            db.vw_ListaPostulanteReporte.Remove(vw_ListaPostulanteReporte);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool vw_ListaPostulanteReporteExists(string key)
        {
            return db.vw_ListaPostulanteReporte.Count(e => e.NombreCompleto == key) > 0;
        }
    }
}
