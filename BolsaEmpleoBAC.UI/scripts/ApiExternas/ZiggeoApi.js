var videoId = '';
window.ziggeoApi = new ZiggeoApi.V2.Application({
    token: __env.ZiggeoApiKey,
    auth: false,
    analytics: false,
    disable_secure_templates: true,
    webrtc_streaming: false
});

ZiggeoApi.V2.Application.getDefault().once("ready", function () {
    var recorder = ZiggeoApi.V2.Recorder.findByElement(document.getElementById("recorder"));
    recorder.on("processing", function () {
        //console.log("processing");
    });
    recorder.on("processed", function () {
        if ($("#btnSiguientePregunta").length != 0) {
            $("#btnSiguientePregunta").removeClass("hidden")
        }
        var IdPregunta = Utils.getUrlParameter('IdPregunta');
        var listPreguntas = [];
        videoId = recorder.get().video;
        if (sessionStorage.hasOwnProperty('videos')) {
           
            var listPreguntas = JSON.parse(sessionStorage.getItem("videos"));
           
            var obj = {
                IdPregunta: IdPregunta,
                Video: videoId
            }
            listPreguntas.push(obj);

            sessionStorage.setItem("videos", JSON.stringify(listPreguntas));
        }
        else
        {
            var obj = {
                IdPregunta: IdPregunta,
                Video: videoId
            }
            listPreguntas.push(obj);
            sessionStorage.setItem("videos", JSON.stringify(listPreguntas));
        }   
    });
});
