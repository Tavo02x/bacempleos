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
    
    public partial class Postulante_Discapacidad
    {
        public int IdPostulante { get; set; }
        public int IdDiscapacidad { get; set; }
        public Nullable<System.DateTime> FechaCreacion { get; set; }
        public Nullable<bool> Borrado { get; set; }
    
        public virtual Discapacidad Discapacidad { get; set; }
        public virtual Postulante Postulante { get; set; }
    }
}
