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
    
    public partial class NivelAcademico
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public NivelAcademico()
        {
            this.Puestos = new HashSet<Puestos>();
            this.Titulos = new HashSet<Titulos>();
        }
    
        public int IdNivelAcademico { get; set; }
        public string Descripcion { get; set; }
        public bool Borrado { get; set; }
        public int Secuencia { get; set; }
        public System.DateTime FechaCreacion { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Puestos> Puestos { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Titulos> Titulos { get; set; }
    }
}