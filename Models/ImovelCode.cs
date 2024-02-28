using System;
using System.Collections.Generic;

namespace Fernanda.Models
{
    public class ImovelCode
    {
        public int ID { get; set; }
        public string Titulo { get; set; }
        public int Quartos {  get; set; }
        public int Banheiros { get; set; }
        public int Vagas { get; set; }
        public string Area { get; set; }
        public string Divulga { get; set; }
        public string Bairro { get; set; }
        public decimal Valor { get; set; }
        public string Capa { get; set; }
        public string Tipo { get; set; }
        public string Endereco { get; set; }
        public int Condominio { get; set; }
        public int IPTU {  get; set; }
        public int Suites { get; set; }
        public string AreaTotal { get; set; }
        public string[] Descricao { get; set; }
        public string[] Comodidades { get; set; }
        public List<string> Fotos { get; set; }
        public string Regiao { get; set; }
        public string Maps { get; set; }
    
    }

}
