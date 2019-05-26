using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class ReportesManager
    {
        #region Puestos
        public static List<ReporteAplicantesPorPuesto_Result> ReporteAplicantesPorPuesto(int idUsuario, int idPais)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var res = context.ReporteAplicantesPorPuesto(idUsuario, idPais).Select(x => x).ToList();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static List<ReportePuestoActivos_Result> ReportePuestosActivos(int idUsuario, int idPais)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var res = context.ReportePuestoActivos(idUsuario, idPais).Select(x => x).ToList();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static List<Usuario> UsuariosPorPais(int idPais)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    int[] arr = new int[2] { 1, 2 };
                    var res = context.Usuario.Include("Paises_Bac_Usuario").Include("Usuario_Roles").Where(x => x.Paises_Bac_Usuario.Any(y => y.IdPais == idPais) && x.Usuario_Roles.Any(z => arr.Contains(z.IdRol))).ToList();
                    List<Usuario> aux = new List<Usuario>();
                    foreach (var user in res)
                    {
                        aux.Add(new Usuario() { IdUsuario = user.IdUsuario, NombreCompleto = user.NombreCompleto, Email = user.Email });
                    }
                    res = aux;
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }
        #endregion Puestos

        #region Postulantes
        public static List<ReporteInteresadosPorPais_Result> ReporteInteresadosPorPais(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var res = context.ReporteInteresadosPorPais(fechaInicio, fechaFinal, paises, estados, idiomas, porcentajeIdioma, discapacidades, sexo, paisRecidencia).Select(x => x).ToList();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static List<ReporteAplicantesPorArea_Result> ReporteAplicantesPorArea(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var res = context.ReporteAplicantesPorArea(fechaInicio, fechaFinal, paises, estados, idiomas, porcentajeIdioma, discapacidades, sexo, paisRecidencia).Select(x => x).ToList();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static List<ReporteAplicantesPorDiscapacidad_Result> ReporteAplicantesPorDiscapacidad(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var res = context.ReporteAplicantesPorDiscapacidad(fechaInicio, fechaFinal, paises, estados, idiomas, porcentajeIdioma, discapacidades, sexo, paisRecidencia).Select(x => x).ToList();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static List<ReporteAplicantesPorEstado_Result> ReporteAplicantesPorEstado(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var res = context.ReporteAplicantesPorEstado(fechaInicio, fechaFinal, paises, estados, idiomas, porcentajeIdioma, discapacidades, sexo, paisRecidencia).Select(x => x).ToList();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static List<ReporteAplicantesPorGenero_Result> ReporteAplicantesPorGenero(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var res = context.ReporteAplicantesPorGenero(fechaInicio, fechaFinal, paises, estados, idiomas, porcentajeIdioma, discapacidades, sexo, paisRecidencia).Select(x => x).ToList();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static List<ReporteAplicantesPorIdioma_Result> ReporteAplicantesPorIdioma(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var res = context.ReporteAplicantesPorIdioma(fechaInicio, fechaFinal, paises, estados, idiomas, porcentajeIdioma, discapacidades, sexo, paisRecidencia).Select(x => x).ToList();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static List<EstadoEntrevista> EstadosEntrevista()
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var res = context.EstadoEntrevista.ToList();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }
        #endregion Postulantes
    }
}