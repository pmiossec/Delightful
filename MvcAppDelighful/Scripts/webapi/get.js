$(document).ready(function () {

    //abonnement � l'�v�nement click du bouton qui recherche tous les bookmarks
    $("#btsearchall").click(function () { AppelSearchAll(); });

    $("#btsearchbyid").click(function () { AppelSearchById(); });

    viewModel = {
        bookmarks: ko.observableArray([])
    };
    
    //on exprime par cette ligne le fait que l'objet nomm� viewModel
    //fait l'objet de la liaison de donn�es (databinding)
    ko.applyBindings(viewModel);

});

function AppelSearchAll() {
    $.get("/api/webbookmarks", "", MethSuccessSearchAll);
}

function AppelSearchById() {
    $.get("/api/webbookmarks/" + $("#idbkm").val(), "", MethSuccessSearchAll);
}

function MethSuccessSearchAll(data, textStatus, jqXHR) {

    //attention depuis les web api 2, si l'utilisateur n'est pas authentifi� on pas le code http 401 directement
    //il faut lire un http header pour voir

    //console.log(textStatus);

    var headerJSON = jqXHR.getResponseHeader('X-Responded-JSON');

    headerJSON = JSON.parse(headerJSON);

    if (headerJSON != null && headerJSON.status == "401") {

        alert("Vous devez vous authentifier pour r�aliser cette action");
        window.document.location.href = "/Account/Login?ReturnUrl=%2FHome%2FAbout";
    }
    else {
        console.log("on met � jour le viewmodel");
        viewModel.bookmarks([]);
        viewModel.bookmarks(data);

        //on rattache une methode au bouton de chaque ligne
        //elle permet de faire apparaitre les champs qui vont permettre de faire la modification
        $(".btUpdate").click(GestionClickBtShowUpdate);

        $(".btDelete").click(function () { GestionClickHL_Delete_Bkm(event, $(this).attr("data-bkm")) });
    }

}


function GestionClickBtShowUpdate() {

    //on r�cup�re l'id du bookmark correspondant au bouton sur lequel on a cliqu�
    var idbkm = $(this).attr("data-bkm");

    //on cherche la ligne qui correspond � cet identifiant
    var $tr = $('tr[data-bkm="' + idbkm + '"]');
    
    //$tr.show();
    $tr.slideToggle('slow', 'swing');
    

    //on rattache une m�thod � chaque bouton qui permettra de r�ellement faire la mise � jour
    $('a[data-bkm="' + idbkm + '"]').click(function () { GestionClickHL_Update_Bkm(event, idbkm) });

}