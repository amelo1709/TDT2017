function mostrarAlerta(icono, texto, tipo) {
    $.notify({
        // options
        icon: icono,
        message: texto,
    }, {
            // settings
            element: 'body',
            position: null,
            type: tipo,
            allow_dismiss: true,
            newest_on_top: false,
            showProgressbar: false,
            placement: {
                from: "top",
                align: "center"
            },
            offset: 20,
            spacing: 10,
            z_index: 1031,
            delay: 1000,
            timer: 1000,
            url_target: '_blank',
            mouse_over: null,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            onShow: null,
            onShown: null,
            onClose: null,
            onClosed: null,
            icon_type: 'class'
        });

    $(".btn").removeClass("disabled");
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function disableBack() {
    //Bloquea el botón de volver
    document.addEventListener("backbutton", function () { return false; }, false);
}

function enableBack() {
    //Desbloquea el botón de volver
    document.addEventListener("backbutton", function () { return true; }, false);}


function alertexit(button) {

    if (button == "0" || button == 1) {

        navigator.app.exitApp();
    }

}

function handleExternalURLs() {
    // Handle click events for all external URLs
    if (device.platform.toUpperCase() === 'ANDROID') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            e.preventDefault();
            var url = $(this).attr('href');
            navigator.app.loadUrl(url, { openExternal: true });
        });
    }
    else if (device.platform.toUpperCase() === 'IOS') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            e.preventDefault();
            var url = $(this).attr('href');
            window.open(url, '_system');
        });
    }
    else {
        // Leave standard behaviour
    }
}

function ejecutarContador() {



    var countDownDate = new Date(configuracion.fechaEvento).getTime();
    // Update the count down every 1 second
    var x = setInterval(function () {

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (seconds < 10) {
            seconds = "0" + seconds
        }
        if (minutes < 10) {
            minutes = "0" + minutes
        }
        if (hours < 10) {
            hours = "0" + hours
        }
        if (days < 10) {
            days = "0" + days
        }
        // Display the result in the element with id="demo"
        //document.getElementById("clock").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";



        $("#dias").html(days)
        $("#horas").html(hours)
        $("#minutos").html(minutes)
        $("#segundos").html(seconds)

        // If the count down is finished, write some text 
        if (distance < 0) {
            $("#countDown").hide()
            clearInterval(x);
        }
    }, 1000);


}

function loadRRSS() {
    $.each(configuracion.redesSociales, function (i, item) {
        $("#ft").append('<a href="' + configuracion.redesSociales[i].url + '" style="padding:15px"><i class="' + configuracion.redesSociales[i].icono + '"></i></a>');
    })
}


function estoyLogeado() {

    if (window.localStorage.getItem("logueado") == "si") {
        return true
    }
    else {
        return false
    }

}

function makeLogin(username, password) {
    var headers;
    headers = {
        "action": "LOGIN"
    }
    data = {
        "email": username,
        "password": password
    }
    $.ajax({
        type: 'POST',
        url: 'http://app.registroenlaweb.com/ActionsApp.aspx',
        data: data,
        headers: headers
    }).done(function (data) {
        if (data.estatus == 'OK') {

            window.localStorage.setItem("username", data.username);

            // localStorage is now empty
            window.location = "scanner.html"
        }
        else {
            mostrarAlerta('fa fa-times', data.mensaje, 'danger')
            window.localStorage.setItem("username", '');
            window.localStorage.setItem("password", '');
            window.localStorage.setItem("rememberme", 'false');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        mostrarAlerta('fa fa-times', 'Ha ocurrido un error: ' + textStatus, 'danger')
    });

}


