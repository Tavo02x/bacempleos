//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BolsaEmpleoBAC.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class vw_PuestosAplicados
    {
        public int IdPuesto { get; set; }
        public string Descripcion { get; set; }
        public int IdPostulante { get; set; }
        public int IdPais { get; set; }
        public string Pais { get; set; }
        public string FechaCierreOferta { get; set; }
        public string FechaRegistro { get; set; }
        public int IdUsuario { get; set; }
        public int IdEstadoPerfil { get; set; }
        public string MobileColumn { get; set; }
    }
}
