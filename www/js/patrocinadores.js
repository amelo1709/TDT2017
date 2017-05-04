var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners 
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("offline", this.onOffLine, false);
        //Carga las redes sociales
        loadRRSS();

        //Ajusta el menú dependiendo si el usuario está logueado
        if (estoyLogeado())
        {
            $("#ItemMenuLogin").hide();
            $("#ItemMenuLogout").show();
            $("#ItemMenuLeads").show();
        }
        else
        {
            $("#ItemMenuLogin").show();
            $("#ItemMenuLogout").hide();
            $("#ItemMenuLeads").hide();
        }


    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready')

        // Mock device.platform property if not available
        if (!window.device) {
            window.device = { platform: 'Browser' };
        }
        handleExternalURLs();
    },

    onOffLine: function () {
        navigator.notification.alert(
            'Esta aplicación solo funciona con acceso a Internet. Verifique la conectividad e intente nuevamente.',  // message
            function () { navigator.app.exitApp(); },         // callback
            'Sin conexión',            // title
            'Salir'                  // buttonName
        );
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {


        console.log('Received Event: ' + id);
    }
};
$(document).ready(function () {
    $.support.cors = true;
    $.allowCrossDomainPages = true;

    //Código exclusivo de inicio.html

    //Deshabilita el botón volver para evitar volver al Splash (index.html)
    //disableBack();

    //Carga los patrocinadores
    loadPatrocinadores()


    if (window.localStorage.getItem("rememberme") == "true") {
        $("#txbEmail").val(window.localStorage.getItem("username"))
        $("#txbPassword").val(window.localStorage.getItem("password"))
        $('#remember-me').prop('checked', true);
    }
    else {
        $("#txbEmail").val('')
        $("#txbPassword").val('')
        $('#remember-me').prop('checked', false);
        window.localStorage.setItem("rememberme", 'false');
    }

    $("#btnLogin").on("click", function (e) {
        var remember
        if ($("#remember-me").is(':checked')) {
            window.localStorage.setItem("username", $("#txbEmail").val());
            window.localStorage.setItem("password", $("#txbPassword").val());
            window.localStorage.setItem("rememberme", 'true');
        }
        else {
            window.localStorage.setItem("username", $("#txbEmail").val());
            window.localStorage.setItem("rememberme", 'false');
        }
        makeLogin($("#txbEmail").val(), $("#txbPassword").val())

    });


    //Controla el comportamiento del menu con el modal de Login
    $('#modalLogin').on('show.bs.modal', function (e) {
        $('.navbar-toggle').click()
    })
});


function loadPatrocinadores() {
    $.each(configuracion.patrocinadores.platino, function (i, item) {
        $("#patroci").append('<img src="' + configuracion.patrocinadores.platino[i].imagen + '" class="btn-app2 img-responsive img-thumbnail" style="max-width: 150px;"/>');
    })
    $("#patroci").append("<hr/>")
    $.each(configuracion.patrocinadores.oro, function (i, item) {
        $("#patroci").append('<img src="' + configuracion.patrocinadores.oro[i].imagen + '" class="btn-app2 img-responsive img-thumbnail" style="max-width: 120px"/>');
    })
    $("#patroci").append("<hr/>")
    $.each(configuracion.patrocinadores.plata, function (i, item) {
        $("#patroci").append('<img src="' + configuracion.patrocinadores.plata[i].imagen + '" class="btn-app3 img-responsive img-thumbnail" style="max-width: 100px"/>');
    })
}