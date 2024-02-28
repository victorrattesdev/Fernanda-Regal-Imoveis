/* PRONTOS */ 

$( document ).ready(function() {
    
    formatCurrency();
    
});


function callContact(id){
    // popula o div com informacoes do imovel
    $(".modal-imovel-html").html( $(".item-id-"+id+" .group-info").html() );    
    // chama o modal
    $("#modal_contato_imovel").modal({backdrop: true});
    // seta o id do objeto
    $("#modal_contato_imovel .id").val(id);
}

function callPage(){
    //
}