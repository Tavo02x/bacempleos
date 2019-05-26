using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.General.Validaciones
{
    public class ManejadorExcepciones
    {
        public static Exception GenerarExcepcion(Exception exObject, string mensaje)
        {
            try
            {
                //Agregar bitacora de ejecucion
                int codigoReferencia = 0;
                mensaje = string.Format(mensaje, codigoReferencia);
                throw new Exception(mensaje);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }
    }
}
