function sendResponse(res, ok, data, message='', status=200) {
    const result  = {
        ok,
        message,
        data,
        status,
        erros: null
    }
    res.status(status).json(result);
}

function sendErrorResponse(res, status, erros, message='', data=null) {
    const result  = {
        ok: false,
        message,
        data,
        status,
        erros
    }
    res.status(status).json(result);
}


module.exports = {
    sendResponse,
    sendErrorResponse
}