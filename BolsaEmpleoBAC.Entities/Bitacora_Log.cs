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
    
    public partial class Bitacora_Log
    {
        public int IdBitacora { get; set; }
        public int IdUsuario { get; set; }
        public string Accion { get; set; }
        public string Descripcion { get; set; }
        public string Direccion_IP { get; set; }
        public string ResponseData { get; set; }
        public System.DateTime FechaCreacion { get; set; }
    
        public virtual Usuario Usuario { get; set; }
    }
}