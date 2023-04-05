const form = document.querySelector('#my-form');

async function submitForm() {
    const formData = new FormData(form);
    const wordsField = formData.get('words');

    try {
        const response = await fetch('/api/response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ words: wordsField })
        });

        if (response.ok) {
            const data = await response.json();
            const answerDiv = document.getElementById('answer');
            answerDiv.innerHTML = data.message;
            console.log(data);
            submitForSpeech(data.message)
        } else {
            console.error('Error:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function submitForSpeech(words) {
    const ttsResponse = await fetch('http://localhost:8787/api/polly/speak', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ words })
    });
    const data = await ttsResponse.json();
    console.log(data.response);
}

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;

recognition.onresult = (event) => {

    const result = event.results[0][0].transcript;
    console.log(event.results[0][0], result);
    console.log(document.getElementById("words"))
    document.getElementById("words").value = result;
    document.getElementById("autorec-button").disabled = false;
    recognition.stop();
    submitForm();
};

function recognize() {

}

function autoRecognize() {
    console.log('starting auto recognition');
    document.getElementById("autorec-button").disabled = true;
    recognition.start();
}
