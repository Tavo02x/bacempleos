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
    
    public partial class vw_feriaEmpleo
    {
        public int IdFeriaEmpleo { get; set; }
        public string Descripcion { get; set; }
        public string FechaCreacion { get; set; }
        public Nullable<bool> Borrado { get; set; }
        public string Titulo { get; set; }
        public string FechaInicio { get; set; }
        public string FechaFinal { get; set; }
        public int FrecuenciaHora { get; set; }
        public string HoraInicio { get; set; }
        public string HoraFinal { get; set; }
        public string IdPais { get; set; }
        public string NombrePais { get; set; }
        public Nullable<int> Aplicantes { get; set; }
        public string MobileColumn { get; set; }
        public string MobileColumn1 { get; set; }
    }
}