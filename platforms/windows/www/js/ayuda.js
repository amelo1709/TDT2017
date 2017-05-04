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

        //Ajusta el men� dependiendo si el usuario est� logueado
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
            'Esta aplicaci�n solo funciona con acceso a Internet. Verifique la conectividad e intente nuevamente.',  // message
            function () { navigator.app.exitApp(); },         // callback
            'Sin conexi�n',            // title
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

    //C�digo exclusivo de inicio.html

    



    //Manejo del Login

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


