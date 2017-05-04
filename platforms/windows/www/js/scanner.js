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
        $("#ItemMenuLogin").hide();
        $("#ItemMenuLogout").show();
        $("#ItemMenuLeads").show();



    },    // deviceready Event Handler
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

    $("#aceptarLead").on("click", function (e) {



        guardarLead($("#idVisitante").val(), window.localStorage.getItem("username"), $("#txbObservaciones").val())

        $("#idVisitante").val("");
        $("#datosVisitante").hide();
        $("#visitanteInvalido").hide();
        $("#visitanteConfirmado").show();
        $("#enEspera").hide();
    });

    $("#rechazarLead").on("click", function (e) {
        $("#txbIdVisitante").val("");
        $("#datosVisitante").hide();
        $("#visitanteInvalido").hide();
        $("#visitanteConfirmado").hide();
        $("#enEspera").show();
    });

    $("#searchIcon").on("click", function (e) {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (result.cancelled) {
                    $("#datosVisitante").hide();
                    $("#visitanteInvalido").hide();
                    $("#visitanteConfirmado").hide();
                    $("#enEspera").show();
                }
                else {

                    obtenerLead(result.text)

                }

            },
            function (error) {
                alert("Falla de escaneo: " + error);
                $("#idVisitante").val("");
                $("#datosVisitante").hide();
                $("#visitanteInvalido").hide();
                $("#visitanteConfirmado").hide();
                $("#enEspera").show();
            },
            {
                preferFrontCamera: false, // iOS and Android
                showFlipCameraButton: false, // iOS and Android
                showTorchButton: true, // iOS and Android
                torchOn: true, // Android, launch with the torch switched on (if available)
                //prompt: "Place a barcode inside the scan area", // Android
                prompt: "Enfoque el c\363digo dentro del \341rea de escaneado", // Android
                resultDisplayDuration: 100, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                //formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations: true, // iOS
                disableSuccessBeep: false // iOS
            }
        );

    })

    $("#dangerIcon").on("click", function (e) {
        $("#txbIdVisitante").val("");
        $("#datosVisitante").hide();
        $("#visitanteInvalido").hide();
        $("#visitanteRepetido").hide();
        $("#visitanteConfirmado").hide();
        $("#enEspera").show();

    })

    $("#warningIcon").on("click", function (e) {
        $("#txbIdVisitante").val("");
        $("#datosVisitante").hide();
        $("#visitanteInvalido").hide();
        $("#visitanteRepetido").hide();
        $("#visitanteConfirmado").hide();
        $("#enEspera").show();

    })


    $("#checkIcon").on("click", function (e) {
        $("#txbIdVisitante").val("");
        $("#datosVisitante").hide();
        $("#visitanteInvalido").hide();
        $("#visitanteConfirmado").hide();
        $("#enEspera").show();

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


function obtenerLead(encriptedText) {

    var data = desencriptar(encriptedText)


    if (data.Nombre == null) {
        $("#datosVisitante").hide();
        $("#visitanteInvalido").show();
        $("#visitanteConfirmado").hide();
        $("#visitanteRepetido").hide();
        $("#enEspera").hide();
    }
    else {
        $("#nombre").text(data.Nombre)
        $("#empresa").text(data.Empresa)
        $("#correo").text(data.Correo)
        $("#telefono").text(data.Telefono)
        $("#idVisitante").val(data.Id);
        $("#txbObservaciones").val('')
        $("#datosVisitante").show();
        $("#visitanteInvalido").hide();
        $("#visitanteConfirmado").hide();
        $("#visitanteRepetido").hide();
        $("#enEspera").hide();
    }

};

function guardarLead(idVisitante, UserName, Observaciones) {

    var headers;
    headers = {
        "action": "SAVELEAD"
    }
    data = {
        "idvisitante": idVisitante,
        "username": UserName,
        "observaciones": Observaciones

    }
    $.ajax({
        type: 'POST',
        url: 'http://app.registroenlaweb.com/ActionsApp.aspx',
        data: data,
        headers: headers
    }).done(function (data) {
        if (data.estatus == "OK") {
            $("#datosVisitante").hide();
            $("#visitanteInvalido").hide();
            $("#visitanteConfirmado").show();
            $("#visitanteRepetido").hide();
            $("#enEspera").hide();
        }
        else {
            $("#datosVisitante").hide();
            $("#visitanteInvalido").hide();
            $("#visitanteConfirmado").hide();
            $("#visitanteRepetido").show();
            $("#enEspera").hide();
        }

    }).fail(function (jqXHR, textStatus, errorThrown) {
        //mostrarAlerta('fa fa-times', 'Ha ocurrido un error: ' + textStatus, 'danger')
        $("#datosVisitante").hide();
        $("#visitanteInvalido").show();
        $("#visitanteRepetido").hide();
        $("#visitanteConfirmado").hide();
        $("#enEspera").hide();

    });






}

function desencriptar(encriptedText) {

    //var cadena = Base64.encode('1|Antonio Alexander Melo Soublette|OnTech Solutions Corp.|amelo@ontech.la|+50768115214');
    //alert(cadena); // dzAwdA==
    //var cadena = Base64.decode(encriptedText);
    //alert(cadena); // w00t

    var cadena = Base64.decode(encriptedText);
    var resultado = cadena.split('|')
    var usuario = {
        Id: resultado[0],
        Nombre: resultado[1],
        Empresa: resultado[2],
        Correo: resultado[3],
        Telefono: resultado[4]
    }

    return usuario
}

