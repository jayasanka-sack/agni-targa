var serverAddress = '/projects/agni-targa'
var api = serverAddress+'/api/v1'

function loadPage(url){
    redirectIfNotLogged();
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


function renderTableData(template, uri, table,successCallback=null, errorCallback=null) {
    $.ajax({
        type: "get",
        url: api + uri,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            let status = jqXHR.status;
            let templateStructure = $(template).html();
            let output = Mustache.render(templateStructure, data);
            table = $(table);
            table.find('tbody').html(output);
            table.DataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [
                    [10, 25, 50, -1],
                    [10, 25, 50, "All"]
                ],
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search records",
                }
            });
            if(successCallback!=null){
                successCallback(data, textStatus, jqXHR);
            }
        },
        error: function (jqXHR) {
            let status = jqXHR.status;
            showNotification('danger##notifications##Something went wrong');
            if(errorCallback!=null){
                errorCallback();
            }
        }
    });
}

function renderData(template, uri, target, isToAppend, successCallback=null, errorCallback=null) {
    $.ajax({
        type: "get",
        url: api + uri,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            let status = jqXHR.status;
            let templateStructure = $(template).html();
            let output = Mustache.render(templateStructure, data);
            if(isToAppend){
                $(target).append(output);
            }else {
                $(target).hide().html(output).fadeIn('slow');
            }
            if(successCallback!=null){
                successCallback(data, textStatus, jqXHR);
            }
        },
        error: function (jqXHR) {
            let status = jqXHR.status;
            console.log(jqXHR);
            showNotification('danger##notifications##Something went wrong');
            if(errorCallback!=null){
                errorCallback();
            }
        }
    });
}

function showNotification(data) {
    var inData = data.split("##");
    $.notify({
        icon: inData[1],
        message: inData[2]

    }, {
        type: inData[0],
        timer: 2000,
        placement: {
            from: 'top',
            align: 'right'
        }
    });
}


function login() {
    var error = $('#lblLoginError');
    var un = $('#txtLoginEmail').val();
    var pw = $("#txtLoginPassword").val();

    if (un === "") {
        error.html("Please Insert Your username"); // check username/ email is empty
    } else if (pw === "") {
        error.html('Please Insert Your Password');
    } else {
        // send data to API
        $.ajax({
            type: "POST",
            url: api+'/login',
            data: 'username='+un+'&password=' + pw,
            dataType: "json",

            success: function (data) { 
                    error.html('<b style="color:green;">you are logged. wait for redirection</b>');
                    window.location.replace(serverAddress); //redirect to particullar dashboard page
                
            },
            error: function () {
                error.html('Wrong Login Data<br/>'); // view error message
            }
        });
    }
}

function logout() {
    $.ajax({
        type: "GET",
        url: api+'/logout',
        dataType: "json",
        success: function (data) {
            window.location.replace(serverAddress+'/login.html'); //redirect to particullar dashboard page

        },
        error: function () {
            error.html('Wrong Login Data<br/>'); // view error message
        }
    });
}

function redirectIfLogged() {
    console.log("hi");
    $.ajax({
        type: "GET",
        url: api+'/user-status',
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log(jqXHR.status);
            window.location.replace(serverAddress);
        }
    });
}

function redirectIfNotLogged() {
    var logged = false;
    $.ajax({
        type: "GET",
        url: api+'/user-status',
        dataType: "json",
        error: function () {
            window.location.replace(serverAddress+'/login.html');
        }
    });
}

