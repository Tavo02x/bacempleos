using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BolsaEmpleoBAC.WebAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/NivelAcademico")]
    public class NivelAcademicoController : ParentController<NivelAcademico>
    {
        public NivelAcademicoController()
        {
            exe = new NivelAcademicoManager();
        }
    }
}
