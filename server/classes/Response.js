function sendResponse(res, ok, data, message='', status=200) {
    const result  = {
        ok,
        message,
        data,
        status,
        error: null
    }
    res.status(status).json(result);
}

function sendErrorResponse(res, status, error, message='', data=null) {
    const result  = {
        ok: false,
        message,
        data,
        status,
        error
    }
    res.status(status).json(result);
}


module.exports = {
    sendResponse,
    sendErrorResponse
}