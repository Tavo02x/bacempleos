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
    
    public partial class vw_EntrevistasRealizadas
    {
        public int IdFeriaEmpleo { get; set; }
        public int IdEntrevista { get; set; }
        public int IdPostulante { get; set; }
        public string NombreCompleto { get; set; }
        public int IdPais { get; set; }
        public string Pais { get; set; }
        public string EntrevistaFechaTipo { get; set; }
        public int IdUsuario { get; set; }
        public string JoinUrl { get; set; }
        public Nullable<int> IdPuesto { get; set; }
        public string Puesto { get; set; }
        public string Email { get; set; }
        public string ColumnMobile1 { get; set; }
        public string ColumnMobile2 { get; set; }
    }
}
