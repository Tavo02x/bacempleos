using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class FeriaEmpleoManager: MasterManager<FeriaEmpleo,BACEntities>
    {
        public List<EstadoEntrevista> GetEstadosEntrevista()
        {
            try
            {
                using (var context = new BACEntities())
                {
                    return context.EstadoEntrevista.ToList();
                }
            }catch(Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public List<TipoEntrevista> GetTipoEntrevista()
        {
            try
            {
                using (var context = new BACEntities())
                {
                    return context.TipoEntrevista.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public dynamic GetFeriaDetalles(int IdFeria, int IdUsuario)
        {
            try
            {
                dynamic obj = new ExpandoObject();
                var feria = GetContext().FeriaEmpleo.Include("Entrevistas").Include("Paises_Bac_FeriaEmpleo").FirstOrDefault(x => x.IdFeriaEmpleo == IdFeria);

                obj.NombreFeria = feria.Descripcion;
                obj.HoraInicio = feria.HoraInicio;
                obj.HoraFinal = feria.HoraFinal;
                obj.FechaInicio = feria.FechaInicio;
                obj.FechaFin = feria.FechaFinal;
                obj.FechaInicioFormat = feria.FechaInicio.ToString("dd/MM/yyyy");
                obj.FechaFinFormat = feria.FechaFinal.ToString("dd/MM/yyyy");
                obj.FechaMin = feria.FechaInicio.ToString("yyyy-MM-dd");
                obj.FechaMax = feria.FechaFinal.ToString("yyyy-MM-dd");
                obj.Paises = GetContext().Paises_Bac_FeriaEmpleo.Include("Paises_Bac").Where(x => x.IdFeriaEmpleo == IdFeria).Select(y => y.Paises_Bac.Descripcion).ToList();
                if (IdUsuario == 0)
                {
                    obj.Agendadas = feria.Entrevistas.Where(x => x.IdEstadoEntrevista == 3).Count();
                    obj.Solicitadas = feria.Entrevistas.Where(x => x.IdEstadoEntrevista == 1).Count();
                    obj.Realizadas = feria.Entrevistas.Where(x => x.IdEstadoEntrevista == 2).Count();
                }
                else
                {
                    var entrevista = GetContext().Entrevistas.Include("FeriaEmpleo").Include("Agenda_Usuario").Where(x => x.FeriaEmpleo.IdFeriaEmpleo == IdFeria);
                    obj.Agendadas = entrevista.Where(x => x.IdEstadoEntrevista == 3 && x.Agenda_Usuario.IdUsuario == IdUsuario).Count();
                    obj.Solicitadas = entrevista.Where(x => x.IdEstadoEntrevista == 1 && x.Agenda_Usuario.IdUsuario == IdUsuario).Count();
                    obj.Realizadas = entrevista.Where(x => x.IdEstadoEntrevista == 2 && x.Agenda_Usuario.IdUsuario == IdUsuario).Count();
                }
               
                obj.Frecuencia = feria.FrecuenciaHora;
                return obj;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public dynamic GetEntrevistadoresFeria(int IdFeria)
        {
            try
            {
                var entrevistadores = GetContext().FeriaEmpleo_Entrevistadores.Include("Usuario").Where(x => x.IdFeriaEmpleo == IdFeria).Select(y => new { y.IdUsuario, y.Usuario.NombreCompleto }).ToList();
                return entrevistadores;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }
    }
}
