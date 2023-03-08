var accessKeyElement = document.getElementById("access-key");
var saveButton = document.getElementById("save");
var ask = document.getElementById("ask");
var queryElement = document.getElementById("query");
var responseElement = document.getElementById("response");
var promptElement = document.getElementById("prompt");
var responsePElement = document.getElementById("response-p");
var errorElement = document.getElementById("error");

ask.addEventListener("click", search);
saveButton.addEventListener("click", saveAccessKey);

function saveAccessKey() {
    let accessKey = accessKeyElement.value;
    if (accessKey) {
        localStorage.setItem("ak", accessKey);
    }
}

function getAccessKey() {
    return localStorage.getItem("ak");
}

function search() {
    let accessKey = accessKeyElement.value;
    if (!accessKey) {
        errorElement.innerHTML = `Please enter access key. You can find it <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key" target="_blank">here</a>.`;
        // return;
    }
    let prompt = queryElement.value;
    if (prompt) {
        ask.disabled = true;
        promptElement.innerHTML = "";
        responseElement.innerHTML = "";
        errorElement.innerHTML = "";
        responsePElement.classList.add('loading');
        fetch(' https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessKey}`,
            },
            body: JSON.stringify({ "model": "text-davinci-003", "prompt": prompt, "temperature": 0, "max_tokens": 300 })
        })
            .then(response => response.json())
            .then(data => {
                ask.disabled = false;
                responsePElement.classList.remove('loading');
                promptElement.innerHTML = prompt;
                responseElement.innerHTML = data.choices[0].text
            })
            .catch(
                error => {
                    console.error(error);
                    promptElement.innerHTML = "";
                    errorElement.innerHTML = "Ugh!!! " + "Something went wrong. Please try again later.";
                }
            );
    }

}

function pwa() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('service-worker.js')
                .then(function (registration) {
                    console.log('Service worker registered:', registration);
                })
                .catch(function (error) {
                    console.log('Service worker registration failed:', error);
                });
        });
    }
}

accessKeyElement.innerHTML = getAccessKey();

pwa();