const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const userMessage = document.getElementById('msg');

const sendButton = document.getElementById('btn');
const micButton = document.getElementById('btn2');


let lastsaid = ""
let lastsentence = ""

const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
const openaiApiKey = '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';

chatForm.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage(userMessage.value);
    }
});

function sendMessage(){
    stopRecording();
    const msg = userMessage.value;
    console.log("hit");
    //clear input
    userMessage.value = "";
    outputMessage(msg);
}

function outputMessage(msg) {
    stopRecording();
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">You</p>
    <p class="text">
        ${msg}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
    openAIAnswer(msg);
}

function openAIAnswer(msg){
    const prompt = msg;
    
    fetch(openaiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
        messages: [
            {"role": "system", "content": "Let's roleplay. Pretend you're a medical clinic. The patient will have a skin disease and you have to prescibe next steps for what they should do after they have been given medication for it. At the end, make sure to say they can book an appointment with Dr. Neon if they choose so. Keep your response to a max of 500 characters. Here is what the patient said: " + prompt},
            {"role": "user", "content": ``},
        ],
          model: 'gpt-3.5-turbo'
        })
      })
      .then(response => response.json())
      .then(data => {
        
        const text = data.choices[0].message.content;
        msg = text;
        AIReply(msg);
      })
      .catch(error => {
        console.error(error);
    });
}

function AIReply(msg) {
    const div = document.createElement('div');
    div.classList.add('reply');
    div.innerHTML = `<p class="meta">AIDoctor</p>
    <p class="text">
        ${msg}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);

    let utterance = new SpeechSynthesisUtterance(msg);
    speechSynthesis.speak(utterance);
}



//------------------------------------------------------------------


let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition,
  recognition,
  recording = false;

let speechTimer;



function speechToText() {
try {
    recognition = new SpeechRecognition();
    recognition.lang = 'en';
    recognition.interimResults = true;
    micButton.style.backgroundColor = "blue";
    recognition.start();

    // Clear any previous speech timer

    recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    lastsaid = speechResult.split(" ").pop();
    lastsentence = speechResult.split(".").pop();
    
    if (event.results[0].isFinal) {
        userMessage.value = " " + speechResult;
    }
    // Reset the speech timer on each result
    
    };

    speechTimer = setTimeout(sendMessage, 3000); // 3 seconds delay before sending
    recognition.onspeechend = () => {
    // Clear the speech timer when speech ends
    clearTimeout(speechTimer);
    speechToText();
    };
    
    recognition.onerror = (event) => {
    stopRecording();
    if (event.error === "no-speech") {
        sendMessage();
    } else if (event.error === "audio-capture") {
        alert(
        "No microphone was found. Ensure that a microphone is installed."
        );
    } else if (event.error === "not-allowed") {
        alert("Permission to use microphone is blocked.");
    } else {
        alert("Error occurred in recognition: " + event.error);
    }
    };
} catch (error) {
    recording = false;
    console.log(error);
}
}

micButton.addEventListener("click", () => {
if (!recording) {
    speechToText();
    recording = true;
} else {
    stopRecording();
}
});

function stopRecording() {
recognition.stop();
clearTimeout(speechTimer); // Clear the speech timer
micButton.style.backgroundColor = "white";
recording = false;
}  