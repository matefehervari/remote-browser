import { Request } from "../types/request";

export const open_browser = (url: string, host: string, port: number) => {
    console.log(url);
    const request: Request = {
        action: 'open-browser',
        payload: url
    };

    console.log(`Requesting send url ${url}`)


    fetch(`http://${host}:${port}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Server error: " + response.status);
            }
            return response.text();
        })
        .then(result => {
            console.log("Response from server:", result);
        })
        .catch(err => {
            console.error("Error sending JSON:", err);
        });
}
