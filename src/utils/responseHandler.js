const sendResponse = (res, { statusCode = 200, status = "success", data, message }) => {
    const response = {
        status,
        ...(data && { data }),
        ...(message && { message }),
    }

    return res.status(statusCode).json(response)
}

export { sendResponse }