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
    
    public partial class FeriaEmpleo_Entrevistadores
    {
        public int IdFeriaEmpleo { get; set; }
        public int IdUsuario { get; set; }
        public int IdPais { get; set; }
        public Nullable<bool> Borrado { get; set; }
        public Nullable<System.DateTime> FechaCreacion { get; set; }
    
        public virtual FeriaEmpleo FeriaEmpleo { get; set; }
        public virtual Usuario Usuario { get; set; }
    }
}
