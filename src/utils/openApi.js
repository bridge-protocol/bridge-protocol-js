const _fetch = require('node-fetch');

class OpenAPIUtility {
    async callApi(method, endpoint, data) {
        if(!method){
            throw new Error("method not provided");
        }

        let options = {
            method: method,
            body: method == "POST" ? JSON.stringify(data) : null,
            headers: method == "POST" ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(data), 'utf8')
            } : {'Content-Type': 'application/json'}
        };

        const response = await _fetch(endpoint, options);
        if (response.ok) {
            let text = await response.text();
            if (text.length > 0)
                return JSON.parse(text);
            else
                return true;
        }
        else {
            var error = response.statusText;
            let text = await response.text();
            if (text) {
                var res = JSON.parse(text);
                if (res && res.message)
                    error = res.message;
            }
            else
                text = response.statusText;

            console.log(error);
            return {};
        }
    }
};

exports.OpenAPIUtility = new OpenAPIUtility();