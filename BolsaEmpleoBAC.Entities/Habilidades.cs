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
    
    public partial class Habilidades
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Habilidades()
        {
            this.Habilidades_Postulante = new HashSet<Habilidades_Postulante>();
        }
    
        public int IdHabilidad { get; set; }
        public string Descripcion { get; set; }
        public Nullable<System.DateTime> FechaCreacion { get; set; }
        public Nullable<bool> Borrado { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Habilidades_Postulante> Habilidades_Postulante { get; set; }
    }
}