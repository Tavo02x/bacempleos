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
    builder.EntitySet<vw_idioma>("vw_idioma");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [Authorize]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class vw_idiomaController : ODataController
    {
        private BACEntities db = new BACEntities();

        // GET: odata/vw_idioma
        [EnableQuery]
        public IQueryable<vw_idioma> Getvw_idioma()
        {
            return db.vw_idioma;
        }
    }
}
