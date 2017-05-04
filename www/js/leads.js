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
    disableBack();

    var headers;
    headers = {
        "action": "READLEADS"
    }
    data = {
        "username": window.localStorage.getItem("username"),
        "idevento": configuracion.idEvento
    }
    $.ajax({
        type: 'POST',
        url: 'http://app.registroenlaweb.com/ActionsApp.aspx',
        data: data,
        headers: headers
    }).done(function (data) {


        $('#datosLeads').DataTable(
            {
                data: data,
                paging: false,
                ordering: false,
                info: false,
                responsive: true,
                language: {
                    "sSearch": "Buscar:",
                    "zeroRecords": "No se encontraron coincidencias",
                    "infoEmpty": "No hay leads disponibles",
                },
                "columns": [
                    { "data": "nombre" },
                    { "data": "empresa" },
                    { "data": "correo" },
                    { "data": "telefono" },
                    { "data": "observaciones" }
                ]
            });


    }).fail(function (jqXHR, textStatus, errorThrown) {
        mostrarAlerta('fa fa-times', 'Ha ocurrido un error: ' + textStatus, 'danger')

    });









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

    $("#menuLogout").on("click", function (e) {
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("password");
        window.localStorage.removeItem("rememberme");
        window.location = "index.html"

    });

    $("#menuSalir").on("click", function (e) {
        navigator.app.exitApp();

    });
});


