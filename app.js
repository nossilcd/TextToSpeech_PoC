const synth = window.speechSynthesis; //speechsynth API

//DOM elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    console.log(voices);
    
    //initial config for each voice (voice + lang)
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = voice.name + '(' + voice.lang + ')';

        //attribs
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);

        //show on SELECT element
        voiceSelect.appendChild(option)
    });
}

getVoices(); //for firefox
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
} else {
    
}

//speak
const speak = () => {
    
    if (synth.speaking) {
        console.error('already speaking');
        return;
    } else if (textInput.value === ''){
        console.error('empty text');
        return;
    }else{
        //show gif background
        body.style.background = 'url(img/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';


        //get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        
        /**SPEAK CONFIG */
        //when done speaking
        speakText.onend = (e) => {
            console.log('Done speaking.');

            //stopping the gif
            body.style.background = '';
        };
        //when error found while speaking
        speakText.error = (e) => {
            console.error('Something went wrong.');
        };
        //set selected voice from the option element
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });
        //set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        //speak it
        synth.speak(speakText);
    }
};

/**EVENT LISTENERS */

//speak on submit
textForm.addEventListener('submit', e=>{
    e.preventDefault(); //preventing from submiting to a file
    speak();
    textInput.blur();
});

//link rate and pitch slide bar to badge
rate.addEventListener('change', e=> rateValue.textContent = rate.value)
pitch.addEventListener('change', e=> pitchValue.textContent = pitch.value)

//execute speak on voice select change
voiceSelect.addEventListener('change', e => speak());