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
    
    public partial class Zona3
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Zona3()
        {
            this.Postulante = new HashSet<Postulante>();
        }
    
        public int IdZona3 { get; set; }
        public string Descripcion { get; set; }
        public int IdZona2 { get; set; }
        public Nullable<bool> Borrado { get; set; }
        public Nullable<System.DateTime> FechaCreacion { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Postulante> Postulante { get; set; }
        public virtual Zona2 Zona2 { get; set; }
    }
}