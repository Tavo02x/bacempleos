using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Topshelf;

namespace BolsaEmpleoBAC.SenderEmail
{
    internal static class SenderService
    {
        internal static void Configure()
        {
           var rc = HostFactory.Run(configure =>
            {
                configure.Service<SenderEmail>(service =>
                {
                    service.ConstructUsing(s => new SenderEmail());
                    service.WhenStarted(s => s.Start());
                    service.WhenStopped(s => s.Stop());
                });
                //Setup Account that window service use to run.  
                configure.RunAsLocalSystem();

                configure.SetServiceName("Sender_Email_BAC_Empleos");
                configure.SetDisplayName("Sender_Email_BAC_Empleos");
                configure.SetDescription("Servicio para envío de correos de BAC Empleos");
            });

            var exitCode = (int)Convert.ChangeType(rc, rc.GetTypeCode());  //11
            Environment.ExitCode = exitCode;
        }
    }
}
