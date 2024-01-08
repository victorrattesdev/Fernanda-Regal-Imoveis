/* Custom JS - Geral */

/* GLOBAIS */
var gAPI            = null;
var gAPIKEY         = null;
var gQS             = null;
var gDATA           = null;
var gELEM           = null;
var gBUSCA          = null;
var gAJAX           = null;
var gFAVS           = [];


$( document ).ready(function() {
    fix_affix();

    $('.mask-tel').mask('(00) 0000-00000');
    
    // verifica quando rola a pagina
    // $(window).scroll(function() {
    //     if ($(window).scrollTop() >= 120) {
    //         $('.topper').css('bottom', '15px');
    //         $('.wrap_atendimento_widget, .callToActionChat').css('bottom', '90px');
    //     } else {
    //         $('.topper').css('bottom', '-60px');
    //         $('.wrap_atendimento_widget, .callToActionChat').css('bottom', '0');
    //     }
    // });
    
    // verifica o click do bt topper
    $('.topper .fa, .back_top').click(function(){
        //console.log("para o alto e avante!");
        var body = $("html, body");
        body.stop().animate({scrollTop:0}, 500, 'swing', function() { 
            //alert("Finished animating");
        });  
    });

    $('.navbar-toggler, .overlay_menu, .close_mobile').click(function(event) {
        var $target = $(this).data('target');
        $($target).toggleClass('opened');
        $('.overlay_menu').toggleClass('opened');
        $('body').toggleClass('no-scroll');
    });

    $('.close_mobile_busca, #open_busca').click(function(event) {
        var $target = $('.container-busca-avancada');
        $($target).toggleClass('opened');
        $('body').toggleClass('no-scroll');
    });

    
});

$(window).resize(function(event) {
    fix_affix();
});


/**
 * Metodo que transforma converte para moeda as classes css currency e currency-full
 * 
 * @param {}
 * @returns {}
 */
function formatCurrency(){
    
    // formata o valor sem centavos
    $('#product-content .currency').each(function(){

        var full_value = $(this).html();
        var float_value = parseFloat(full_value).toFixed(2);
        
        float_value = float_value.split(".");

        $(this).html(float_value[0]);
        $(this).mask('000.000.000', {reverse: true});
    });

    // formata o valor com centavos
    $('#product-content .currency-full').each(function(){

        var full_value = $(this).html();
        var float_value = parseFloat(full_value).toFixed(2);
        
        float_value = float_value.replace(".","");

        $(this).html(float_value);
        $(this).mask('000.000.000,00', {reverse: true});
    });

}


/**
 * Metodo que transforma uma array natural do serialize de um form para uma array indexada
 * 
 * @param {type} unindexed_array
 * @returns {unresolved}
 */
function IndexDataForm(unindexed_array){
    var indexed_array   = {};
    var nKey            = "";
    var nVal            = "";
    
    $.map(unindexed_array, function(n, i){
        iVal = n['value'];
        if(iVal){
            
            iVal = iVal.split('.').join("");
            if( (n['name']=='email') || (n['name']=='Email') ){
                iVal = n['value'];
            }
                
            iVal = iVal.replace( /\+/g, '');
            if(nKey==n['name']){
                nVal = nVal+";"+iVal;

            }else{
                nVal = iVal;
            }            
            nKey = n['name'];
            indexed_array[nKey] = nVal;
        }
    });
    
    return indexed_array;
}

/**
 * 
 * @param {type} email
 * @returns {Boolean}Metodo de validação de email
 */
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
 * Metodo que retorna a querystring da URL
 * @param {type} name
 * @param {type} url
 * @returns {String}
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Metodo que mantem o registro dos ultimos acessos aos produtos pelo visitante
 * @param {type} ContentID
 * @param {type} Finalidade
 * @returns {Boolean}
 */
function userLastAccess(ContentID, Finalidade){
    
    // verifica se a finalidade foi setada
    if(Finalidade==""){ return false; }

    // marca o produto acessado
    var produtoAcessado = '{"ID":"'+ContentID+'","Finalidade":"'+Finalidade+'"}';    
    
    // carrega o cookie 'guest'
    var guest = getCookie('guest');
    if(guest){ 
        
        // converte a string em JSON
        guest = JSON.parse(guest); 

        // verifica se existe um atributo de nome visitados e adiciona um item se existir, caso contrario, inicia o atributo
        var visitados = guest.visitados
        if(!visitados){ visitados = [] }

        // verifica qual o ultimo produto acessado registrado
        var ultimoRegistrado = JSON.stringify(visitados[0]);
        
        // verifica se o acessado = o ultimo registrado
        if(ultimoRegistrado==produtoAcessado){ return false; }

        // transforma em JSON o produto acessado
        var produtoAcessado = JSON.parse( produtoAcessado );

        // insere na array visitados o ultimo imovel acessado
        visitados.unshift(produtoAcessado);

        // corta a array num limite de 10 itens
        visitados = visitados.slice(0,10);

        // transforma em string os visitados
        guest.visitados = visitados;
        
        // registra no tracking de usuario
        userTrack(guest);
    }           
}


/**
 * Funcao que armazena num cookie as informacoes do visitante
 * @param {type} JSON
 * @returns {Boolean}
 */
function userTrack(obj){

    // carrega o cookie do visitante
    var guest = getCookie('guest');
    if(guest){ guest = JSON.parse(guest); }
    
    // mescla as informações ja armazenadas com as novas
    Object.assign(guest, obj);

   // converte o JSON em string
    var sJSON = JSON.stringify(obj);
    
    setCookie('guest', sJSON, 365);
    
    return true;
    
}


function callAtendimentoOnline(){
    //
}




/**
 * Funcao prototipo - ainda nao foi terminada
 * 
 * @param {type} url
 * @param {type} data
 * @returns {undefined}
 */
function getAuth(url, data){
    $.ajax({
        method: "POST",
        url:    url,
        data:   data,
        statusCode: {
          404: function() {
            alert( "erro 404" );
          },
          500: function() {
            alert( "erro 500" );
          }
        }
    })
    .done(function( data ) {
        console.log(data);
        
    });     

}

/**
 * Metodo para retornar o valor de um cookie
 * @param {type} cname
 * @returns {String}
 */
window.getCookie = function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
/**
 * Metodo para setar o valor para um cookie
 * @param {type} cname
 * @param {type} cvalue
 * @param {type} exdays
 * @returns {undefined}
 */
window.setCookie = function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}



function fix_affix() {

    var exist = $('.affix-anchor').offset();
    var viewWidth = $(window).width();
    
    if( exist ) {
        
        var $formRef = $('.affix-anchor');
        var _heightForm = $formRef.outerHeight();
        
        var widthAffix     = $formRef.width();
        $formRef.width(widthAffix);
        
        var $content_form = $('.content_form');

        if ( $(window).width() > 1100 ) {
            $(window).scroll(function(event) {

                var viewportTop = $(window).scrollTop();
                // var viewportBottom = viewportTop + $(window).height();

                var _start = $content_form.offset().top;
                var content_form_bottom = _start + $content_form.outerHeight();
                
                var _heigthHeader = $('.main-header').outerHeight() + 15;

                // Se o objeto passar do topo
                if ( ( viewportTop + _heigthHeader ) >= _start ) {

                     $formRef.css({
                        position: 'fixed',
                        top: _heigthHeader
                    });

                     var formPositionBottom = $formRef.offset().top + _heightForm;
                    // se chegar no final da div 
                    if ( formPositionBottom >= content_form_bottom ) {
                        $formRef.css({
                            position: 'absolute',
                            top: ( $content_form.outerHeight() - _heightForm ) 
                        });
                    } 

                // Se voltar para o topo
                } else {
                    $formRef.css({
                        position: 'absolute',
                        top: 0
                    });
                }

                

            }); 
        }


    }
    
}



function imageToSvg() { 
    $('img.tosvg').each(function() {
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = $(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            
            // Check if the viewport is set, else we gonna set it if we can.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });
}
imageToSvg();

function imageToSvgData() { 
    $('img.tosvgdata').each(function() {
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('data-blazy');

        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = $(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            
            // Check if the viewport is set, else we gonna set it if we can.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });
}
