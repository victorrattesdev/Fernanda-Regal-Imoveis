using Fernanda.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Fernanda1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            List<ImovelCode> items = new List<ImovelCode>();
            if (TempData["imoveis"] == null)
            {
                string json = System.IO.File.ReadAllText(@"C:\Users\liuka\Fernanda\imoveiscode.json");
                items = JsonConvert.DeserializeObject<List<ImovelCode>>(json);
                TempData["imoveis"] = items;
            }
            else
            {
                items = TempData["imoveis"] as List<ImovelCode>;
                TempData.Keep("imoveis");
            }
            return View(items);
        }

        public ActionResult About()
        {

            return View(TempData["imoveis"]);
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult Contato()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult imovel001()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}