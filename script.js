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
    promptElement.innerHTML = "";
    responseElement.innerHTML = "";
    errorElement.innerHTML = "";
    let accessKey = accessKeyElement.value?.trim();
    if (!accessKey) {
        errorElement.innerHTML = `Please enter access key. You can find it <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key" target="_blank">here</a>.`;
        return;
    }
    let prompt = queryElement.value?.trim();
    if (prompt) {
        ask.disabled = true;
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
    } else {
        errorElement.innerHTML = "Please provide a partial sentence to complete";
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

queryElement.onkeyup = function (e) {
    if (e.key == "Enter" ||
        e.code == "Enter" ||
        e.keyCode == 13
    ) {
        search();
    }
}

accessKeyElement.innerHTML = getAccessKey();

pwa();