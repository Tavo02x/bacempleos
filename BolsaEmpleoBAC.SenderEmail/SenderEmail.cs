using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Timers;
using BolsaEmpleoBAC.General;
using BolsaEmpleoBAC.General.Utilitarios;

namespace BolsaEmpleoBAC.SenderEmail
{
    public class SenderEmail
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        readonly Timer  _timer;
        public SenderEmail()
        {
            _timer = new Timer(300000) { AutoReset = true };
            _timer.Elapsed += (sender, eventArgs) => Correo.ProcessQueue();
        }
        public void Start()
        {
            log.Info("Inicio del servicio: " + DateTime.Now.ToString());
            _timer.Start();
        }
        public void Stop()
        {
            log.Info("Detenido del servicio: " + DateTime.Now.ToString());
            _timer.Stop();
        }
    }
}
