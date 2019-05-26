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
    Puede que la clase WebApiConfig requiera cambios adicionales para agregar una ruta para este controlador. Combine estas instrucciones en el método Register de la clase WebApiConfig según corresponda. Tenga en cuenta que las direcciones URL de OData distinguen mayúsculas de minúsculas.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using BolsaEmpleoBAC.Entities;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<vw_EntrevistasAgendadas>("vw_EntrevistasAgendadas");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [Authorize]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class vw_EntrevistasAgendadasController : ODataController
    {
        private BACEntities db = new BACEntities();

        // GET: odata/vw_EntrevistasAgendadas
        [EnableQuery]
        public IQueryable<vw_EntrevistasAgendadas> Getvw_EntrevistasAgendadas()
        {
            return db.vw_EntrevistasAgendadas;
        }
    }
}
