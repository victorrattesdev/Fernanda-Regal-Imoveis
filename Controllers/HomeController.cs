using Fernanda.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using static Fernanda1.Controllers.ImoveisController;

namespace Fernanda1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {            

            List<ImovelCode> items = new List<ImovelCode>();
            if (TempData["imoveis"] == null)
            {
                string json = System.IO.File.ReadAllText(@"h:\root\home\fernandaregal-001\www\fernanda1\imoveiscode.json");
                items = JsonConvert.DeserializeObject<List<ImovelCode>>(json);
                foreach (var item in items)
                {
                    item.Fotos = DisplayImages(item.ID);
                }
                TempData["imoveis"] = items;
            }
            else
            {
                items = TempData["imoveis"] as List<ImovelCode>;
                TempData.Keep("imoveis");
            }
            Redirect("~/");
            return View(items);
        }
        public List<string> DisplayImages(int? ID)
        {
            string[] fileNames1 = Directory.GetFiles(Server.MapPath("~/Content/img/imovel" + ID));
            List<string> images1 = new List<string>();
            foreach (string fileName in fileNames1)
            {
                images1.Add("../Content/img/imovel" + ID + "/" + Path.GetFileName(fileName));
            }

            return (images1);
        }

        //public ActionResult Index(List<ImovelCode> items)
        //{

        //    return View(items);
        //}



        public ActionResult About()
        {

            return View();
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
        public ActionResult Outros()
        {
            if (TempData["resultadoFiltro"] != null)
            {
                return View(TempData["resultadoFiltro"]);
            }

            //var count = TempData["resultadoFiltro"] as List<ImovelCode>;

            //TempData["Erromensagem"] = "errei";

            //if (count == null || count.Count == 0)
            //{
            //    ModelState.AddModelError("Erro", "A contagem de itens é zero.");
            //    // Ou você pode usar TempData["Erro"] = "A contagem de itens é zero.";
            //}

            List<ImovelCode> items = new List<ImovelCode>();
            items = TempData["imoveis"] as List<ImovelCode>;
            TempData.Keep("imoveis");

            //if (TempData["imoveis"] == null)
            //{
            //    string json = System.IO.File.ReadAllText(@"C:\Users\liuka\Fernanda1\imoveiscode.json");
            //    items = JsonConvert.DeserializeObject<List<ImovelCode>>(json);
            //    TempData["imoveis"] = items;
            //}
            //else
            //{
            //    items = TempData["imoveis"] as List<ImovelCode>;
            //    TempData.Keep("imoveis");
            //}
            return View(items);
        }

        public ActionResult Pesquisar(string bairroPesquisa, string regiaoPesquisa, string tipoPesquisa)
        {   
            var items = TempData["imoveis"] as List<ImovelCode>;
            TempData.Keep("imoveis");
            
            var objetosFiltrados = items.Where(o => o.Regiao.ToLower().Contains(regiaoPesquisa.ToLower()) && o.Tipo.ToLower().Contains(tipoPesquisa.ToLower()) && o.Bairro.ToLower().Contains(bairroPesquisa.ToLower())).ToList();

            TempData["resultadoFiltro"] = objetosFiltrados;

            // Atualize o TempData com os objetos filtrados

            return RedirectToAction("Outros");
        }

    }
}