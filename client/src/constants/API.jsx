export default class API {
    static get(url, successCallback, errorCallback) {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            response.json().then((data) => {
                data.status = response.status;
                
                if (this.isSuccessfulStatus(response.status) && successCallback !== undefined) {
                    successCallback(data);
                }

                if (this.isClientErrorStatus(response.status) || this.isServerErrorStatus((response.status))) {
                    errorCallback(data);
                }
            });
        });
    }

    static post(url, body, successCallback, errorCallback) {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        }).then((response) => {
            response.json().then((data) => {
                data.status = response.status;
                
                if (this.isSuccessfulStatus(response.status) && successCallback !== undefined) {
                    successCallback(data);
                }
    
                if (this.isClientErrorStatus(response.status) && errorCallback !== undefined) {
                    // Automatically log out if the token is invalid
                    if (response.status === 401) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("username");
                        window.location = "/login?error=INVALID_TOKEN";
                    }

                    errorCallback(data);
                }
            });
        });
    }

    static isClientErrorStatus(status) {
        return status >= 400 && status < 500;
    }

    static isServerErrorStatus(status) {
        return status >= 500 && status < 600;
    }
    
    static isSuccessfulStatus(status) {
        return status >= 200 && status < 300;
    }
}