//http://save-coco.blogspot.com/2010/02/javascriptgetexample.html
function getQueryString( paramName ){
    paramName = paramName .replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]").toLowerCase();
    var reg = "[\\?&]"+paramName +"=([^&#]*)";
    var regex = new RegExp( reg );
    var regResults = regex.exec( window.location.href.toLowerCase() );
    if( regResults === null ) return "";
    else return regResults [1];
}

function getQueryParams(paramNames){
    let params = {};
    paramNames.forEach((paramName)=>{
        params[paramName] = getQueryString(paramName);
    });
    return params;
}

function constructQueryParams(params){
    let paramNames = Object.keys(params);
    let paramList=[];
    paramNames.forEach((paramName)=>{
        paramList.push(paramName + "=" + params[paramName]);
    });
    // 
    return  paramList.join("&");
}

function updateQueryParams(params){
    let newUrl = constructQueryParams(params);
    let urlBase = window.location.protocol + "//" + window.location.host + window.location.pathname;
    urlBase = urlBase + "?" + newUrl;
    history.pushState(null, null, urlBase);
}

module.exports = {
    getQueryParams: getQueryParams,
    constructQueryParams: constructQueryParams,
    updateQueryParams: updateQueryParams
};