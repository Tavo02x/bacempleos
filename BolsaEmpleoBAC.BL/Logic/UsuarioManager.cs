using BolsaEmpleoBAC.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class UsuarioManager : MasterManager<Usuario, BACEntities>
    {
        public string GetPaisesUsuario(int userId)
        {
            try
            {
                List<int> resultado = new List<int>();
                var lista = GetContext().Paises_Bac_Usuario.Where(x => x.IdUsuario == userId).ToList();
                foreach (var nodo in lista)
                {
                    resultado.Add(nodo.IdPais);
                }

                return JsonConvert.SerializeObject(resultado);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public string GetUrlTempUsuario(int userId)
        {
            try
            {
                var urlTemp = GetContext().Usuario.FirstOrDefault(x => x.IdUsuario == userId).UrlIngresoTemporal;

                return urlTemp;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }
    }
}
