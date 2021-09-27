test_stimuli = jsPsych.randomization.repeat(test_stimuli, 1);

var images = [
    test_stimuli.map(a => a.first_image),
    test_stimuli.map(a => a.second_image),
    mask_stimulus
];

var timeline = [];

var preload = {
    type: 'preload',
    images: images
}
timeline.push(preload);

var image_dimensions = { 
    original: [1024, 768],
    scaled: [500, 375]
}

var welcome = {
    type: "html-button-response",
    stimulus: "<h3>Welcome to the experiment! This is a demo.</h3>",
    choices: ["Next"]
};
timeline.push(welcome);

var introduction = {
    type: "html-button-response",
    stimulus: "<h4>Try to spot the difference between two pictures!</h4>" +
    "<p>You will see one picture at a time. The picture that is shown will quickly alternate." +
    "<br>Try to find the difference as quickly as possible!" + 
    "<br>When you find the difference between the two pictures, press the spacebar to stop the images from alternating." +
    "<br>Then, use your mouse and click on the location where you think the change occurred.</p>",
    choices: ["Let's try it out"]
};
timeline.push(introduction);

var timing_explanation = {
    type: "html-button-response",
    stimulus: "<p>You will be timed on how quickly you can spot the difference." +
        "<br>The timer will begin as soon as you see the first image, and will stop as soon as you press the spacebar." +
        "<br>So, try to <b>press the spacebar</b> as soon as you spot the difference!</p>",
    choices: ["Understood, let's get started"]
};

var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div class="container-debug" style="background-color:gray;height:375px;width:500px">' +
        '<div style="font-size:60px;color:white;text-align:center;vertical-align:middle;line-height:375px;">+</div>' +
        '</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 2000,
    on_start: function(trial) {
        document.body.style.cursor = 'none';
    }
}

var trial = {
    type: 'cb-flicker',
    first_image: jsPsych.timelineVariable('first_image'),
    second_image: jsPsych.timelineVariable('second_image'),
    mask: "../Images/gray.png",
    patches: jsPsych.timelineVariable('patches'),
    choices: [' '],
    image_dimensions: image_dimensions,
    delay_change_onset_alt: jsPsych.timelineVariable(delay_property)
};

var feedback = {
    type: "html-button-response",
    stimulus: function() {
        var last_trial_hit = jsPsych.data.get().last(1).values()[0].hit;
        if (last_trial_hit) {
            return `<h3>Correct!</h3>`
        } else {
            return "<h3>Sorry, that's not where the change was.</h3>"
        }
    },
    choices: ["Let's see the next one"],
    on_start: function(){
        fetch('https://jspsych-server.herokuapp.com/pilot')
        .then(response=>response.json())
        .then(resp=>console.log(resp))
    }
};

timeline.push({
    timeline: [fixation, trial, feedback],
    timeline_variables: example_stimulus
});
timeline.push(timing_explanation);
timeline.push({
    timeline: [fixation, trial, feedback],
    timeline_variables: test_stimuli
});


var trial = {
    type: 'cb-flicker',
    first_image: jsPsych.timelineVariable('first_image'),
    second_image: jsPsych.timelineVariable('second_image'),
    mask: mask_stimulus,
    patches: jsPsych.timelineVariable('patches'),
    choices: [' '],
    image_dimensions: image_dimensions,
    delay_change_onset_alt: jsPsych.timelineVariable(delay_property)
};

var feedback = {
    type: "html-button-response",
    stimulus: function() {
        var last_trial_hit = jsPsych.data.get().last(1).values()[0].hit;
        if (last_trial_hit) {
            return "<h3>Correct!</h3>"
        } else {
            return "<h3>Sorry, that's not where the change was.</h3>"
        }
    },
    choices: ["Let's see the next one"]
};
timeline.push({
    timeline: [trial, feedback],
    timeline_variables: test_stimuli
});

var end_note = {
    type: "html-keyboard-response",
    stimulus: "<p><b>DO NOT EXIT THE EXPERIMENT.<br>" +
    "Please wait - the experiment will continue in 10 seconds.</b></p>",
    choices: jsPsych.NO_KEYS,
    trial_duration: 10000,
    data: {
        on_screen: 'end_note'
    },
    on_start: function(){
        fetch('https://jspsych-server.herokuapp.com/pilot')
        .then(response=>response.json())
        .then(resp=>console.log(resp))
    }
}
timeline.push(end_note);

function save_data_json() {
    data = jsPsych.data.get().filter({trial_type: "cb-flicker"}).json();
    fetch('https://jspsych-server.herokuapp.com/pilot', { 
        method: 'post',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ 
        exp_data: data
        })
    })
  }