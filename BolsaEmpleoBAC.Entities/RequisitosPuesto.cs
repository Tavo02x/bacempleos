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
    
    public partial class RequisitosPuesto
    {
        public int IdRequisito { get; set; }
        public string Descripcion { get; set; }
        public int IdPuesto { get; set; }
    
        public virtual Puestos Puestos { get; set; }
    }
}
