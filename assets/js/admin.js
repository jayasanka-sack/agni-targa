var serverAddress = '/myhamper.me'
var api = serverAddress+'/api/v1'

function loadPage(url){

    $.ajax({
        type: "POST",
        url: 'async/'+url,
        dataType: "html", success: function (data) {
            $('#page').html(data);
        },
        error: function () {
            loadPage('dashboard.html')
        }
    });

}
function pageRosolve(hash) {
    hash = hash.substr(1);
    hash = hash.replace("QA","\/")
    hash = hash.replace("UU","..\/")
    hash = hash.replace(/QQ/g,"?")
    hash = hash.replace("-xx",".php")
    hash = hash.replace("-hh",".html")
    return hash;
}

function changeActive(elementId){
    var navBar = $('#navBar')
    navBar.find("li").removeClass('active')
    $('#'+elementId).addClass('active')
}



function refreshPage(){
    setTimeout(function () {
        loadPage(pageRosolve(window.location.hash))
    }, 1000);
}

