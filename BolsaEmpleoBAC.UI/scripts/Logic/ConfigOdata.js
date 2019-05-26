var OConfig =
    {
        condEquals: "==",
        condDif: "!=",
        condGreaterThan: ">",
        condGreaterOrEqualsThan: ">=",
        condLessThan: "<",
        condLessOrEqualsThan: "<=",
        condLike: "like",
    }

var OTypes =
    {
        default: "default",
        between: "between",
        string: "string"
    }

$(document).ready(function () {
    if (sessionStorage.hasOwnProperty("token"))
    {
        var token = sessionStorage.getItem("token");

        var decode = Utils.decodeJWT();
        o().config({
            endpoint: window.__env.apiUrl + '/odata/',
            version: 4,
            isCors: false,
            inlinecount: true,
            headers: [
                { name: 'Content-Type', value: 'application/json', },
                { name: 'Authorization', value: 'Bearer ' + token },
                { name: 'username', value: decode.unique_name },
            ]
        });

        //let timerId = setTimeout(function tick() {
        //    console.log('tick');
        //    timerId = setTimeout(tick, 2000); // (*)
        //}, 2000);
    }
});