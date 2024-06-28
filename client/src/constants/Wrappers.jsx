export default class Wrappers {
    static BackendResponse(response, successCallback, errorCallback) {
        response.json().then((json) => {
            if (isSuccessfulStatus(response.status)) {
                successCallback(json);
            }

            if (isClientErrorStatus(response.status)) {
                // Automatically log out if the token is invalid
                if (json.message === "INVALID_TOKEN") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    window.location = "/login?error=INVALID_TOKEN";
    
                }
                errorCallback(json);
            }
        });
        

        return response;
    }

    static SendRequest(url, method, body, successCallback, errorCallback) {
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        }).then((response) => {
            Wrappers.BackendResponse(response, successCallback, errorCallback);
        });
    }

    isClientErrorStatus(status) {
        return status >= 400 && status < 500;
    }

    isServerErrorStatus(status) {
        return status >= 500 && status < 600;
    }
    
    isSuccessfulStatus(status) {
        return status >= 200 && status < 300;
    }
}