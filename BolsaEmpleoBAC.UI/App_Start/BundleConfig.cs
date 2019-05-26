using System.Web;
using System.Web.Optimization;

namespace BolsaEmpleoBAC.UI
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery/jquery-{version}.js",
                        "~/Scripts/jquery/jquery-ui.min.js",
                        "~/Scripts/jquery/jquery.modal.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                        "~/Scripts/bootstrap.min.js",
                        "~/Scripts/respond.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/angular.js"));

            bundles.Add(new ScriptBundle("~/bundles/scripts/registro").Include(
                        "~/Scripts/material/material.min.js",
                        "~/Scripts/Logic/ApiService.js",
                        "~/Scripts/md5.js",
                        "~/Scripts/registro.js"));

            bundles.Add(new StyleBundle("~/Content/css/fontawesome").Include(
                        "~/Content/fontawesome-all.min.css",
                        "~/Content/fontawesome.min.css"));

            bundles.Add(new StyleBundle("~/Content/css/material").Include(
                        "~/Content/material/material-theme.css"
                        ));

            bundles.Add(new StyleBundle("~/Content/css/registro").Include(
                        "~/Scripts/jquery/jquery.modal.css",
                        "~/Content/registro.min.css"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                        "~/Content/bootstrap.min.css",
                        "~/Content/Site.min.css"));
        }
    }
}
