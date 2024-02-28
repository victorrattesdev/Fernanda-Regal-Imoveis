using Fernanda.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Fernanda1.Controllers
{
    public class ImoveisController : Controller
    {
        public ActionResult Imovel(int? codigo)
        {
            var items = TempData["imoveis"] as List<ImovelCode>;
            TempData.Keep("imoveis");

            var dadosIMovel = items.Where(x => x.ID == codigo)
                                   .FirstOrDefault();

            //dadosIMovel.Fotos = DisplayImages(codigo);

            return View(dadosIMovel);

        }

        public ActionResult Lancamentos(string label)
        {
            var items = TempData["imoveis"] as List<ImovelCode>;
            TempData.Keep("imoveis");

            label = "OPORTUNIDADE!!!";

            var destaqueIMovel = items.Where(x => x.Divulga == label)
                                      .ToList();
                                      //////.Equals("OPORTUNIDADE!!!");                                   

            return View(destaqueIMovel);

        }
        public ActionResult Planta(string label)
        {
            var items = TempData["imoveis"] as List<ImovelCode>;
            TempData.Keep("imoveis");

            label = "NA PLANTA!";

            var plantaIMovel = items.Where(x => x.Divulga == label)
                                      .ToList();
            //////.Equals("OPORTUNIDADE!!!");                                   

            return View(plantaIMovel);

        }
    }
    }
