﻿using System;
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

namespace BolsaEmpleoBAC.WebAPI.Controllers
{
    /*
    Puede que la clase WebApiConfig requiera cambios adicionales para agregar una ruta para este controlador. Combine estas instrucciones en el método Register de la clase WebApiConfig según corresponda. Tenga en cuenta que las direcciones URL de OData distinguen mayúsculas de minúsculas.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using BolsaEmpleoBAC.Entities;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<vw_Puestos>("vw_Puestos");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [AllowAnonymous]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class vw_PuestosController : ODataController
    {
        private BACEntities db = new BACEntities();

        // GET: odata/vw_Puestos
        [EnableQuery]
        public IQueryable<vw_Puestos> Getvw_Puestos()
        {
            return db.vw_Puestos;
        }
    }
}