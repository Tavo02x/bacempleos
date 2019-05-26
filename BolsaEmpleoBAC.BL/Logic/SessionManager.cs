using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.Drupal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
   public class SessionManager
    {
        private BACEntities bacdb = new BACEntities();
        private DrupalEntities drupaldb = new DrupalEntities();

        public bool Login(int IdUser)
        {
            try
            {

                var userBac = bacdb.Usuario.FirstOrDefault(x => x.IdUsuario == IdUser);
                var userDrupal = drupaldb.users.FirstOrDefault(x => x.uid == userBac.IdDrupal);

                var sessionDrupal = drupaldb.sessions.FirstOrDefault(x => x.uid == userBac.IdDrupal);
                if (sessionDrupal != null)
                {
                    if (userBac.Sesiones != null)
                    {
                        userBac.Sesiones.Add(new Sesiones()
                        {
                            IdUsuario = IdUser,
                            FechaCreacion = DateTime.Now,
                            FechaExpiración = DateTime.Now,
                            Hostname = "0",
                            User_key = "",
                            Secret_key = "",
                        });
                        bacdb.SaveChanges();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else if(userBac.Sesiones!=null)
                {
                    return false;
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public bool Logout(int IdUser)
        {
            try
            {

                var userBac = bacdb.Usuario.FirstOrDefault(x => x.IdUsuario == IdUser);
                var userDrupal = drupaldb.users.FirstOrDefault(x => x.uid == userBac.IdDrupal);

                var sessionDrupal = drupaldb.sessions.FirstOrDefault(x => x.uid == userBac.IdDrupal);

                if (sessionDrupal != null)
                {
                    drupaldb.sessions.Remove(sessionDrupal);
                }

                var sessionBac = userBac.Sesiones.FirstOrDefault();
                if (sessionBac != null)
                {
                    bacdb.Sesiones.Remove(sessionBac);
                }

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public bool SessionValidator(int IdUser)
        {
            try
            {

                var userBac = bacdb.Usuario.FirstOrDefault(x => x.IdUsuario == IdUser);
                var userDrupal = drupaldb.users.FirstOrDefault(x => x.uid == userBac.IdDrupal);

                var sessionDrupal = drupaldb.sessions.FirstOrDefault(x => x.uid == userBac.IdDrupal);

                if (sessionDrupal != null)
                {
                    return true;
                }

                var sessionBac = userBac.Sesiones.FirstOrDefault();
                if (sessionBac != null)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}
