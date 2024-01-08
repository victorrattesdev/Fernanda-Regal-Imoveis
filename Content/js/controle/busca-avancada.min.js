
/* BUSCA AVANCADA */ 
$( document ).ready(function() { 
    
    // seta switch de finalidade
    var swtFin = $("#InputsFinalidade").val();
    if(swtFin==='aluguel') swtFin = 'locacao';
    $("#switch-"+swtFin).attr("checked","checked");
    $(".switch-selected").removeClass("hide");
    
    // inicia as mascaras de moeda
    $('#input-number-min').mask('000.000.000', {reverse: true});
    $('#input-number-max').mask('000.000.000', {reverse: true});
    $('#input-area-min').mask('000.000.000', {reverse: true});
    $('#input-area-max').mask('000.000.000', {reverse: true});
    
    // mostra ou esconde as listas de quartos, suites, banheiros e vagas
    $('html').click(function(){
       $('.box-filtro').css('display','none');
    });
    $('.select-to-check').click(function(event){
        event.stopPropagation();
        var elem = $(this);
        elem.next('.filtro-check').css('display','block');
    });
    $('.opcoes-check *').click(function(event){ event.stopPropagation(); });
          
    // atualizar os checkbox de acordo com os dados da URL / Inputs da API
    updateFiltroChecks();
    
    //eventos    
    // evento antigo de troca de finalidade
    $(".bt_finalidade").click(function(e){
        var elem = $(this);
        var fin = (elem.data("fin"));
        e.preventDefault();
        
        $(".bt_finalidade").removeClass("active");
        elem.addClass("active");
        $("#InputsFinalidade").val(fin);

        // if(fin == 'aluguel') {
        //     updateValue = 10000;  
        // } else {
        //     updateValue = 5000000;  
        // }
        
        // zera a paginacao
        resetPage();
    });

    
    // novo evento de troca de finalidade
    $(".switch_finalidade").click(function(e){
        // debugger
        var elem = $(this);
        var fin = (elem.data("fin"));
        $("#InputsFinalidade").val(fin);
        
        var updateValue;

        if(fin == 'aluguel'){
            updateValue = 10000;  
        } else {
            updateValue = 5000000;  
        }

        $('#input-number-max').val(updateValue);
        // updateSliderRangeValor(0, updateValue);
        // $('#InputsValorMax').val(updateValue);

        // zera a paginacao
        resetPage();
    });
    

    // quando algum checkbox e alterado, altera os inputs de busca 
    $('input.search-checkbox').change(function(){
        prepDataInput( $(this) );        
        resetPage();
    });    

    // quando o select de Tipo e alterado , altera os inputs de busca 
    $('select.select-filtro-lateral').change(function(){
        var elem = $("#"+$(this).data("filtro"));
        elem.val( $(this).val() );
        resetPage();
    });    
    
    // quando o select de itens por pagina e alterado, altera os inputs de busca 
    $("#products-per-page").change(function(){
        $("#InputsActualPage").val('1');
        var elem = $("#"+$(this).data("filtro"));
        elem.val( $(this).val() );  
        resetPage();
        doSearch();
    });

    // quando o select de ordenacao e alterado, altera os inputs de busca 
    $("#products-order").change(function(){
        var elem = $("#"+$(this).data("filtro"));
        elem.val( $(this).val() );  
        doSearch();
    });
    
    // botao voltar clicado
    $(window).on('popstate', function() {
        //doSearch();
        location.reload();
    });    
    
    setTimeout(function(){ 
        // inicializa o input/select de regiao
        initInputRegiao();
        // inicializa o input/select de codigo
        initInputCodigo();    
    }, 1000);
    
});

/**
 * Funcao que processa a busca no mobile
 * Processo tradicional, com carregamento de uma lista e separado por paginacao
 * 
 */
function doSearch(compileHandlebar){
    if (compileHandlebar == null) { compileHandlebar = true}
    // pega o resultado da busca
    getParamSearch();

    if (compileHandlebar) {
        // inicializa a lista de produtos  
        initProdutosLista(gAPI+gQS, gDATA, gELEM);   
    } else {
        location.reload();
    }
    
}

/**
 * Funcao que processa a busca no mobile
 * Trabalha inserindo ao final da lista de produtos a pagina seguinte, nao existindo "paginacao" e sim rolamento
 * 
 */
function doSearchMobile(){
        
    // verifica a pagina e soma +1, para carregas os produtos da pagina seguinte
    var ActualPage  = $("#InputsActualPage").val();
    ActualPage      = Number(ActualPage)+1;
    $("#InputsActualPage").val(ActualPage);

    // nao usa o callPage
    var call = false;

    // pega o resultado da busca
    getParamSearch(call);
    
    // inicializa a lista de produtos
    initProdutosLista(gAPI+gQS, gDATA, $("#product-list-mobile"));

}


function getParamSearch(call){
    // if (!call) {call=true}
    // PASSO 1
    // - Atualizar a URL de forma que caso o usuario recarregue a pagina, o resultado seja o mesmo do AJAX
    var form            = $('#main-search');
    // processa os dados do AutoSuggest
    var valAutoSuggest  = $("#AutoSuggest").val();
    
    if(valAutoSuggest && valAutoSuggest != null && valAutoSuggest != undefined && valAutoSuggest.length > 0) {
        $("input[name='AutoSuggest']").val("[" + valAutoSuggest + "]");
    }
    
    
    var unindexed_array = form.serializeArray();
    var indexed_array   = {};
    var sFinalidade     = "";
    var sTipo           = "";
    var sRegiao         = "";
    var sUF             = "";
    var sURL            = ""; 
        
    // - Nomalizacao da serializacao em uma array chave-valor
    indexed_array       = IndexDataForm(unindexed_array);

    // Filtra o array para remover o 0 a esquerda dos números
    for (var prop in indexed_array) {
        if ( !isNaN(indexed_array[prop]) ) {
            indexed_array[prop] = parseInt(indexed_array[prop]);
        }
    }

    // - Cria uma variavel com o JSON e com a QueryString
    var strJSON         = JSON.stringify(indexed_array);
    var strQueryString  = form.find(":input[value!='']").serialize();
 
    // - Pega os parametros da URL de finalidade, tipo e regiao
    sFinalidade = $("#InputsFinalidade").val();
    if(sFinalidade){
        sFinalidade = "/"+sFinalidade;
    }
    sTipo = $("#InputsTipos").val();
    if(sTipo){
        sTipo = "/"+sTipo;
    }else{
        sTipo = "/imoveis";
    }
    
    sUF = $("#InputsUF").val();
    
    // verifica se a busca e feita por UF
    if(sUF){
        sURL = window.location.pathname;
    }else{
        sURL = sFinalidade + sTipo + sRegiao;
    }
    
    // atualiza a barra de navegacao com a url de busca
    // window.history.pushState(null, null, window.location.pathname + "?busca=" + strJSON);
    window.history.pushState(null, null, sURL + "?busca=" + strJSON);
    
    //seta o cookie da busca
    setCookie('search', strJSON, 365);
    
    // executa codigo especifico para cada pagina se necessario, nos "controller/<controller>.js" antes de efetuar a busca de fato
    if(call){
        callPage();
    }
    
    // apenas atualizando os checkboxes dos filtros
    updateFiltroChecks();

    // PASSO 2
    // - Atualizar a lista de produtos da pagina
    //   esses paramentros com 'g' sao globais definidas no arquivo template base do controller
    //   atualizamos o gQS e rodamos a busca
    gQS     = "?"+strQueryString.replace(/\+/g,"%20");
    
}


function initProdutosLista(url, data, container, callback){
    
    // exibe o loader e esconde outras mensagens
    setLoading();
    
    // processa a consulta AJAX da API
    if(gAJAX=="abort"){ return false };
    
    gAJAX = $.ajax({
        method: "GET",
        url:    url,
        data:   data,
        cache:  true,
        statusCode: {
            401: function() {
                pageListMessages(401);
            },
            404: function() {
                pageListMessages(404);
            },
            500: function() {
                pageListMessages(500);
            },
            undefined: function() {
                pageListMessages(null);
            }
        }
    })
    .done(function( json ) {
        
        //var totalCount = json.totalCount;
        var totalCount = json.items.length;

        if(totalCount==0){

            Handlebars.registerHelper('formatCurrency', function(value) {
                return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            });

            $(".ttcount").html( 0 );
            $(".ttmin").html( 0 );
            $(".ttmax").html( 0 );

            if (json.similares) {
                json.similares.map(function(item) {
                    var image = item.Imagens.length > 0 ? item.Imagens[0] : 0;
                    item.ImageUrl = 'https://enjoy.inforcedata.com.br/image/' + image + '.jpg'
                    return item;
                })

                if (json.similares.length > 3) {
                    json.similares = json.similares.slice(0, 3);
                }
            }

            //Aparecer imóveis similares
            var source = $('.nenhum-encontrado-sugestao').text(); 
            var template = Handlebars.compile(source);
            var html = template(json);

            $('.btn_box-veja-mais').addClass('d-none');
            $('.nenhum-encontrado').html(html);
            $('.nenhum-encontrado').removeClass('hide');
            
        }else{
            pageListMessages(-1);   // limpa as mensagens de erro que podem estar presentes               
            $(".ttcount").html(json.totalCount);
            $(".ttmin").html( ((json.page-1) * json.pagesize) + 1 );
            $(".ttmax").html( (json.page * json.pagesize) );
                
            // seta o total no html
            $("#lista-totalcount").html(json.totalCount);

            // seta a paginacao
            $(".pagination-container").pagination({
                items: json.totalCount,
                itemsOnPage: json.pagesize,
                currentPage: json.page,
                hrefTextPrefix: "javascript:setPage(",
                hrefTextSuffix: ")",            
                prevText: '<i class="fas fa-chevron-left"></i>',
                nextText: '<i class="fas fa-chevron-right"></i>',
                cssStyle: 'light-theme'
            });
            
            // verifica se existe proxima pagina
            if( (json.pagesize * json.page) > json.totalCount ){
                $(".btn_box-veja-mais").remove();
            }

            // Filtra algumas caracteristicas para não ir todas para a listagem
            var mycarac = ['Piscina', 'Churrasqueira', 'Segurança 24 horas'];
            for ( i in json.items) {
                var item = json.items[i];
                var caracteristicas = item.Caracteristicas;
                var caracteristicasOn = [];

                if (caracteristicas) {
                    caracteristicasOn = caracteristicas.filter( function( elem ) {
                        return mycarac.indexOf(elem) !== -1;
                    } );
                }
                item.caracteristicasOn = caracteristicasOn;

                // aproveitando o loop para remover o centavo dos valores
                if (item.ValorVendaMinimo) {
                    item.ValorVendaMinimo = Math.trunc( item.ValorVendaMinimo );
                }

            }

            Handlebars.registerHelper('slug', function (str) {
                str = str.replace(/^\s+|\s+$/g, ''); // trim
                str = str.toLowerCase();
            
                // remove accents, swap ñ for n, etc
                var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
                var to   = "aaaaeeeeiiiioooouuuunc------";
                for (var i=0, l=from.length ; i<l ; i++) {
                    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                }
    
                str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                    .replace(/\s+/g, '-') // collapse whitespace and replace by -
                    .replace(/-+/g, '-'); // collapse dashes
    
                return str;
            })
    
            Handlebars.registerHelper('qtdquartosname', function (str) {
                var str = str > 1 ? 'Quartos' : 'Quarto';
                return str;
            })
    
            Handlebars.registerHelper('qtdsuitesname', function (str) {
                var str = str > 1 ? 'Suítes' : 'Suíte';
                return str;
            })
    
            Handlebars.registerHelper('qtdvagasname', function (str) {
                var str = str > 1 ? 'Vagas' : 'Vaga';
                return str;
            })
    
            Handlebars.registerHelper('qtdwcname', function (str) {
                var str = str > 1 ? 'Banheiros' : 'Banheiros';
                return str;
            })
    
            
            var source      = $("#lista-item-handle").html();
            var template    = Handlebars.compile(source);
            var html        = template(json);

            // atualiza a lista
            if(container.attr("id")=="product-list-mobile"){

                // mobile = adicionar itens a lista
                container.append(html);                
                                
            }else{
                // site desk = atualizar lista
                container.scroll();           
                container.html(html);                                           
              
            }

            // Transformando icones em svg
            imageToSvg();
            
            // processa os slides de cada item da lista de produtos
            $(".product-list-container .tagged-box-slides").slick({
                slidesToShow: 1, 
                slidesToScroll: 1,
                nextArrow: '<i class="fa fa-chevron-right"></i>',
                prevArrow: '<i class="fa fa-chevron-left"></i>',
                responsive: [
                  {
                    breakpoint: 600,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      infinite: false,
                      dots: false
                    }
                  }                
                ]
            });
            
            $('.product-list-container .tagged-box-slides').each(function(){
                $(this).removeClass('tagged-box-slides');
            });

            $(".product-list-container .currency").mask('000.000.000', {reverse: true});              
        }
        
        // Se o modulo de FAVORITOS estiver habilitado
            // marca como favoritado os itens que estiverem visiveis na lista geral de produtos    
            $.each(gFAVS, function( i, item ) {
                if( (item) && (item.ID) ){
                    $(".item-id-"+item.ID+" .icon-favoritos .btn-favoritos").addClass("favoritado");
                    flyHeart(item.ID);
                }
            });                
        // Se o modulo de FAVORITOS estiver habilitado
        if ( typeof(callback) === 'function' ) {
            callback();
        }

        setLoading('off');
        
    });     
}

function resetPage(page){
    var InputsActualPage = $('#InputsActualPage').val();
    if (!page) { page= InputsActualPage }
    $("#InputsActualPage").val(page);
}

function setPage(page){
    $("#InputsActualPage").val(page);
    doSearch();
}

function setPageSize(pageSize){
    $("#InputsPageSize").val(pageSize);
    doSearch();
}



/**
 * Metodo que trata os dados dos checkbox para a API
 * @param {type} elem Elemento interagido
 * @returns {undefined} O retorno é direto na DOM, no elemento alvo definido pelo data-target do elemento interagido
 */
function prepDataInput( elem ){
    var value   = elem.val();
    var target  = elem.data("target");
    
    var eTarget = $("#Inputs"+target);
    var eValue  = "";
           
    // confere todos os checks marcados
    $('input[data-target="'+target+'"]:checked').each(function( index ) {                
        if(index > 0) eValue = eValue + ";"; 
        eValue = eValue + $( this ).val();                
    });

    // atualiza o input alvo    
    eTarget.val(eValue);
    
    // atualiza o title do select
    elem.parents('.group-select').find('.box-filtro .titulo .qtd').html(eValue.replace(/;/g,", "));
    elem.parents('.group-select').find('.select-to-check .titulo .qtd').html(eValue.replace(/;/g,", "));
    
    if(eValue){
        elem.parents('.group-select').find('.box-filtro .ttfiltro').css('display','none');
        elem.parents('.group-select').find('.select-to-check .ttfiltro').css('display','none');
    }else{
        elem.parents('.group-select').find('.box-filtro .ttfiltro').css('display','initial');
        elem.parents('.group-select').find('.select-to-check .ttfiltro').css('display','initial');
    }
    
}

function initSliderValor(){
    // SLIDER VALOR
    var SliderValor     = document.getElementById('slider-range-valor');
    // INPUTS DO SLIDER
    var inputNumberMin  = document.getElementById('input-number-min');
    var inputNumberMax  = document.getElementById('input-number-max');
    // INPUTS DA BUSCA
    var inputValorMin   = document.getElementById('InputsValorMin');
    var inputValorMax   = document.getElementById('InputsValorMax');
    
    // NAO PODE TER PONTOS NEM SINAL DE '+' NO JSON
    ValorMin = inputNumberMin.value.replace( /^\D+/g, '');
    ValorMax = inputNumberMax.value.replace( /^\D+/g, '');
   
    ValorMin = (ValorMin.split('.').join(""));
    ValorMax = (ValorMax.split('.').join(""));
    
    // HACK PARA CORRIGIR BUG DO FIREFOX
    if((ValorMin==ValorMax)||(parseInt(ValorMin) > parseInt(ValorMax))){
        ValorMin = 0;
    }    
    
    // Inicializa o slider
    noUiSlider.create(SliderValor, {
      start: [ ValorMin, ValorMax ],
      // step: 100,
      // snap: true,
      connect: true,
      range: {
        'min': 0,
        'max': parseInt(ValorMax)
      },
      format: wNumb({
        decimals: 0,
        thousand: '.',
        //prefix: ' (R$) ',
      })
    });
    
    // popula os inputs da busca com o valor do slider
    inputValorMin.value = (ValorMin);
    inputValorMax.value = (ValorMax);

    // quando o slider for atualizado
    SliderValor.noUiSlider.on('update', function( values, handle ) {
        
        var index = values.indexOf(values[handle]);
        var value = values[handle];

        // verifica qual e o slider que esta mudando
        if ( index == 0 ) {
            inputNumberMin.value = value;
            inputValorMin.value  = (value.split('.').join(""));
        } else {
            inputNumberMax.value = value;
            inputValorMax.value  = (value.split('.').join(""));
        }
        resetPage();
    });
    
    // atualiza os sliders em caso de alteracao direto no input
    $(".input-range-valor").on('change', function(){
        var min = inputNumberMin.value.split('.').join("");
        var max = inputNumberMax.value.split('.').join("");

        SliderValor.noUiSlider.updateOptions({
            range: {
                'min': 0,
                'max': parseInt(max)
            }
    });
        
    SliderValor.noUiSlider.set([ min, max ]);     
        resetPage();
    });

}

function updateSliderRangeValor(_min, _max) {
    // debugger
    var _SliderValor = document.getElementById('slider-range-valor');

    _SliderValor.noUiSlider.updateOptions({
        range: {
                'min': _min,
                'max': _max
            }
    });

    _SliderValor.noUiSlider.set([_min, _max]);
    
}



function initSliderAreaUtil(){
    // SLIDER AREA UTIL 
    var SliderArea = document.getElementById('slider-range-area');
    // INPUTS DO SLIDER
    var inputNumberMin  = document.getElementById('input-area-min');
    var inputNumberMax  = document.getElementById('input-area-max');
    // INPUTS DA BUSCA
    var inputAreaMin    = document.getElementById('InputsAreaMin');
    var inputAreaMax    = document.getElementById('InputsAreaMax');

    // NAO PODE TER PONTOS NEM SINAL DE '+' NO JSON
    AreaMin = inputNumberMin.value;
    AreaMax = inputNumberMax.value;
    
    
    AreaMax = (AreaMax.split('.').join(""));    
    AreaMin = (AreaMin.split('.').join(""));    
    
    // HACK PARA CORRIGIR BUG DO FIREFOX
    if((AreaMin==AreaMax)||(parseInt(AreaMin) > parseInt(AreaMax))){
        AreaMin = 0;
    }     
    
    // Inicializa o slider
    noUiSlider.create(SliderArea, {
      start: [ AreaMin, AreaMax ],
      // step: 1,
      // snap: true,      
      connect: true,
      range: {
        'min': 0,
        'max': parseInt(AreaMax)
      },
      format: wNumb({
        decimals: 0,
        thousand: '.',
       // postfix: ' (m²) ',
      })
    });
    
    // popula os inputs da busca com o valor do slider
    inputAreaMin.value = (AreaMin);
    inputAreaMax.value = (AreaMax);
    
    // quando o slider for atualizado
    SliderArea.noUiSlider.on('update', function( values, handle ) {
        
        var index = values.indexOf(values[handle]);
        var value = values[handle];

        if ( index == 0 ) {
            inputNumberMin.value = value;
            inputAreaMin.value = (value.split('.').join(""));
        } else {
            inputNumberMax.value = value;
            inputAreaMax.value = (value.split('.').join(""));
        }
        resetPage();    
    });
        
    // atualiza os sliders em caso de alteracao direto no input
    $(".input-range-area").on('change', function(){
        var min = inputNumberMin.value.split('.').join("");
        var max = inputNumberMax.value.split('.').join("");
                
        SliderArea.noUiSlider.updateOptions({
            range: {
                'min': 0,
                'max': parseInt(max)
            }
    });                
                
    SliderArea.noUiSlider.set([ min, max ]);
        resetPage();    
    });
}    

/**
 * funcao vazia para nao dar undefined
 * essa funcao de callback serve para processar algo depois de criar a url e antes de atualizar a lista
 * @returns {undefined}
 */
function callPage(){}


function updateFiltroChecks(){   
    // bt de finalidade
    var dataFinalidade = $("#InputsFinalidade").val();
    var elem = $('.bt_finalidade[data-fin="'+dataFinalidade+'"]');
    $(".bt_finalidade").removeClass("active");
    elem.addClass("active");
    
    // select de tipos
    $('.select-filtro-lateral').each(function() {
        // pega o elemento html
        var elemFiltro  = $(this);
        // pega o filtro relacionado a ele
        var inputFiltro = $("#"+elemFiltro.data('filtro'));
        // verifica o valor do filtro usado na busca
        var valueFiltro = inputFiltro.val();
        // retorna o id do filtro
        var idFiltro    = $(this).attr("id");
        
        // seta o valor do filtro
        if(valueFiltro=='imoveis') valueFiltro = '';
        elemFiltro.val(valueFiltro);
        
    });

    // checkbox
    $('.filtro-check').each(function( index ) {
        // pega o elemento html
        var elemFiltro  = $(this);
        // pega o filtro relacionado a ele
        var inputFiltro = $("#"+elemFiltro.data('filtro'));
        // seta o valor puro do input
        var rawValue    = inputFiltro.val();
        // troca o ponto e virgula por apenas virgulas
        var eValue      = rawValue.replace(/;/g,", ");
        // seta a array de valores
        var valueFiltro = rawValue.split(';');        
        // retorna o id do filtro
        var idFiltro    = $(this).attr("id");

        // se o filtro estiver preenchido, exibe ele
        //if (inputFiltro.val()){
        //    $('#'+idFiltro).css("display","block");
        //}else{
        //    $('#'+idFiltro).css("display","none");
        //}
        
        // veirica cada checkbox do filtro
        $('#'+idFiltro+' input[type="checkbox"]').each(function( index ) {
            var currCheckbox = $(this);
            
            if( valueFiltro.includes(currCheckbox.val()) ){
                currCheckbox.prop('checked', true);
            }
        });
                       
        // atualiza o label do checkbox
        var elem = $('#'+idFiltro);
        elem.parents('.group-select').find('.box-filtro .titulo .qtd').html(eValue);
        elem.parents('.group-select').find('.select-to-check .titulo .qtd').html(eValue);
        
        if(eValue){
            elem.parents('.group-select').find('.box-filtro .ttfiltro').css('display','none');
            elem.parents('.group-select').find('.select-to-check .ttfiltro').css('display','none');
        }else{
            elem.parents('.group-select').find('.box-filtro .ttfiltro').css('display','initial');
            elem.parents('.group-select').find('.select-to-check .ttfiltro').css('display','initial');
        }
        
    });
}


function initInputRegiao(){
    var api = $("#API_PATH").data("path");
    
    $("#AutoSuggest").select2({
        placeholder: "Digite a cidade, bairro ou empreendimento...",
        ajax: {
            url: api + '/'+gAPIKEY+'/AutoSuggest',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    term: params.term, // search term
                    page: params.page
                };
            },
            processResults: function (data, params) {
                params.page         = params.page || 1;
                var itens           = [];
                var childs          = [];
                var tempSuggestTipo = "";
                var optGrpIdx       = 0;
                var optIdx          = 0;
                var lenData         = data.length-1;
                
                $.each(data, function (i, jsonItem) {
                    
                    // caso seja um item so
                    if(lenData == 0){
                        itens[0] = {
                            text: jsonItem.SuggestTipoAsString,
                            children: [{
                                id : JSON.stringify(jsonItem), 
                                text: jsonItem.Nome,
                                SuggestTipoAsString: jsonItem.SuggestTipoAsString
                            }]
                        }
                    }
                    
                    // se for o ultimo item e se o termo agrupador anterior for diferente do atual, fecha o grupo e popula com os filhos
                    if( (tempSuggestTipo != jsonItem.SuggestTipoAsString) || (i == lenData) ){
                        if(childs.length > 0){
                            
                            if(i == lenData){
                                childs[optIdx] = {
                                    id : JSON.stringify(jsonItem),
                                    text: jsonItem.Nome,
                                    SuggestTipoAsString: jsonItem.SuggestTipoAsString
                                };                                                             
                            }
                            
                            itens[optGrpIdx] = {
                                text: childs[optIdx-1].SuggestTipoAsString,
                                children: childs
                            }
                            optGrpIdx = optGrpIdx + 1;
                            childs = [];
                            optIdx = 0;
                        }
                        tempSuggestTipo = jsonItem.SuggestTipoAsString;
                    }
                    
                    // se o termo agrupador for igual popula o array de filhos
                    if(tempSuggestTipo == jsonItem.SuggestTipoAsString){
                        childs[optIdx] = {
                            id : JSON.stringify(jsonItem),
                            text: jsonItem.Nome,
                            SuggestTipoAsString: jsonItem.SuggestTipoAsString
                        };           
                        optIdx = optIdx + 1;
                    }                    
                });

                return {
                    results: itens,
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
            },
            cache: true
        },
        language: {
            noResults: function(){
                return "Nenhum resultado foi encontrado.";
            },
            errorLoading: function () {
                    return "Erro ao carregar.";
            },
            inputTooLong: function (args) {
                    return "Texto grande demais. Digite menos de "+args.maximum+" caracteres.";
            },
            inputTooShort: function (args) {
                    return "Digite ao menos "+args.minimum+" caracteres. ";
            },
            loadingMore: function () {
                    return "Carregando mais...";
            },
            maximumSelected: function (args) {
                    return "Máximo selecionado!";
            },
            searching: function () {
                    return "Procurando...";
            }            
        },        
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        minimumInputLength: 3
    });    
    
    // atualiza o input de busca por regiao
    fillInputRegiao( $("#InputsAutoSuggest").val() );
     
}
// funcao que prepara o valor do campo InputAutoSuggest e preenche o input de busca por Regiao
function fillInputRegiao(stringRegiao){
    if((stringRegiao==undefined) || (stringRegiao=="")){
        
        return false;

    }else{    
    
        var jsonRegiao = JSON.parse(stringRegiao);

        var arrayRegiao = $.map(jsonRegiao, function(value, index) {
            return [JSON.stringify(value)];
        });       
        
        $.each(arrayRegiao, function (i, item) {
            $('#AutoSuggest').append($('<option>', { 
                value: item,
                text : jsonRegiao[i].Nome
            }));
        });
        
        $("#AutoSuggest").val( arrayRegiao ).trigger("change");        

    }
}


function initInputCodigo(){
    var api = $("#API_PATH").data("path");
    
    $("#ImovelCodigo").select2({
        placeholder: "Digite o código do imóvel",
        ajax: {
            url: api + '/'+gAPIKEY+'/Imovel/Codigos',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    term: params.term, // search term
                    page: params.page
                };
            },
            processResults: function (data, params) {
                params.page         = params.page || 1;
                var itens           = [];
                var optIdx          = 0;
                
                $.each(data, function (i, jsonItem) {
                    // se o termo agrupador for igual popula o array de filhos
                    itens[optIdx] = {
                        id : "ID-"+jsonItem.ID,
                        text: jsonItem.Codigo,
                        tag: jsonItem.Codigo,
                    };           
                    optIdx = optIdx + 1;
                });

                return {
                    results: itens,
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
            },
            cache: true
        },
        language: {
            noResults: function(){
                return "Nenhum resultado foi encontrado.";
            },
            errorLoading: function () {
                    return "Erro ao carregar.";
            },
            inputTooLong: function (args) {
                    return "Texto grande demais. Digite menos de "+args.maximum+" caracteres.";
            },
            inputTooShort: function (args) {
                    return "Digite ao menos "+args.minimum+" caracteres. ";
            },
            loadingMore: function () {
                    return "Carregando mais...";
            },
            maximumSelected: function (args) {
                    return "Máximo selecionado!";
            },
            searching: function () {
                    return "Procurando...";
            }            
        },        
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        minimumInputLength: 2
        
    }).on('select2:select', function (evt) {
        //console.log(evt);
        //console.log(evt.params.data.tag);
        window.location = "/imovel/"+evt.params.data.tag+"/"+evt.params.data.id;
    });
         
}

function pageListMessages(code){

    $("#product-list").html("");
    
    $(".message-box > div").each(function(){
        $(this).addClass("hide");
    });
    
    if(code==0){
        //console.log( "Nenhum produto encontrado" );
        $(".nenhum-encontrado").removeClass("hide");
    }
    
    if(code==401){
        //console.log( "Acesso não autorizado" );
        $(".acesso-nao-autorizado").removeClass("hide");        
    }
    
    if(code==404){
        //console.log( "Página não encontrada" );
        $(".conteudo-nao-encontrado").removeClass("hide");        
    }
    
    if(code==500){
        //console.log( "Erro 500" );
        $(".erro-servidor").removeClass("hide");        
    }
    
    if(code==null){
        //console.log( "Erro 500" );
        $(".erro-servidor").removeClass("hide");                
    }

    setLoading('off');
}


function setLoading(load){
    if(load=='off'){
        $(".lista-loader").hide();
        $(".full-loader").hide();
        $(".btn-mobile-veja-mais").show();
    }
    else if(load=='remove'){
        $(".lista-loader").remove();
        $(".full-loader").remove();
        $(".btn-mobile-veja-mais").remove();
        $(".nenhum-encontrado").remove();  
    }
    else{
        $(".lista-loader").show();
        $(".full-loader").show();
        $(".btn-mobile-veja-mais").hide();
        $(".nenhum-encontrado").addClass("hide");        
    }
}