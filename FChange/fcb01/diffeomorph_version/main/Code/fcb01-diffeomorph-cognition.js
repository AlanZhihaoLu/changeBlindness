var timeline = [];

var test_stimuli = jsPsych.randomization.repeat(raw_stimuli, 1);

// test_stimuli = test_stimuli.slice(0,5);

var images = [
    test_stimuli.map(a => a.first_image),
    test_stimuli.map(a => a.second_image),
    example_stimulus.map(a => a.first_image),
    example_stimulus.map(a => a.second_image),
    example_stimulus[0].circled_image
];

var preload = {
    type: 'preload',
    images: images
}
timeline.push(preload);

var mask_stimulus = 'gray.png';

var image_dimensions = { 
    original: [1024, 768],
    scaled: [700, 525]
};

var welcome = {
  type: "html-button-response",
  stimulus: "<h3>Welcome to the experiment!</h3><p>Your task is to <b>spot a distortion in a flickering picture.</b></p>",
  choices: ["Next"]
  
};
timeline.push(welcome);

var introduction = {
    type: "html-button-response",
    stimulus: "<p>You will see a picture <b>flicker</b> on your screen." +
    "<br>There will be a portion of the picture that will <b>distort</b> while the picture is flickering." +
    "<br>Try to find the location of the distortion <b>as quickly as possible!</b></p>",
    choices: ["Next"]
};
timeline.push(introduction);

var instructions = {
  type: "html-button-response",
  stimulus: "<p>When you find the distortion, <b>press the spacebar once</b> to stop the image from flickering." +
  "<br>Then, <b>use your mouse and click</b> on the location where you saw the distortion.</p>",
  choices: ["Next"]
};
timeline.push(instructions);

var in_case_timeout = {
    type: "html-button-response",
    stimulus: "<p>If you can't find the distortion in 30 seconds, the image will automatically stop flickering." +
        "<br>If that happens, just make a guess as to where the distortion occurred.",
    choices: ["Let's try it out!"]
};
timeline.push(in_case_timeout);

var timing_explanation = {
    type: "html-button-response",
    stimulus: "<p>You will be timed on how quickly you can spot the distortion." +
        "<br>The timer will begin as soon as you see the first image, and will stop as soon as you press the spacebar." +
        "<br>So, try to <b>press the spacebar</b> as soon as you spot the distortion!</p>",
    choices: ["Got it, gotta go fast!"]
};

var sbs_example = {
    type: "html-button-response",
    stimulus: '<h3>Were you able to spot it? Just in case, here were the two versions, side-by-side, with the distortion circled in red.</h3>' +
    `<img src="${example_stimulus[0].first_image}" alt="First image" width="500" height="375">` +
        `<img src="${example_stimulus[0].circled_image}" alt="Distortion-circled image" width="500" height="375">`,
    choices: ["I see it!"]
};

var second_example = {
  type: "html-button-response",
  stimulus: "<p>Let's try one more demo trial before we begin the experiment.</p>",
  choices: ["Let's see it!"]
}

var recap = {
  type: "html-button-response",
  stimulus: "<h3>So, to recap:</h3>"+
  "<p>You will see a picture <b>flicker</b> on your screen."+
  "<br>A distortion will appear while the picture is flickering."+
  "<br>Find the location of the distortion <b>as quickly as possible!</b>"+
  "<br>When you find the distortion, <b>press the spacebar once</b> to stop the image from flickering."+
  "<br>Then, <b>use your mouse and click</b> on the location where you saw the distortion.</p>",
  choices: ["Understood, let's get started! (Begin the experiment)"]
};
            
var fixation = {
    type: 'html-keyboard-response',
    stimulus: `<div class="container-debug" style="background-color:gray;height:${image_dimensions.scaled[1]}px;width:${image_dimensions.scaled[0]}px">` +
        `<div style="font-size:60px;color:white;text-align:center;vertical-align:middle;line-height:${image_dimensions.scaled[1]}px;">+</div>` +
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
    mask: mask_stimulus,
    patches: jsPsych.timelineVariable('patches'),
    choices: [' '],
    image_dimensions: image_dimensions,
    trial_duration: 30000,
    flicker_end_image: 1
};
var feedback = {
    type: "html-button-response",
    stimulus: function() {
        var last_trial_hit = jsPsych.data.get().last(1).values()[0].hit;
        if (last_trial_hit) {
            return `<h3>Correct!</h3>`
        } else {
            return "<h3>Sorry, that's not where the distortion was.</h3>"
        }
    },
    choices: ["Let's see the next one"]
};

timeline.push({
    timeline: [fixation, trial, feedback],
    timeline_variables: [example_stimulus[0]]
});
timeline.push(sbs_example);
timeline.push(timing_explanation);
timeline.push(second_example);
timeline.push({
    timeline: [fixation, trial, feedback],
    timeline_variables: [example_stimulus[1]]
});
timeline.push(recap);
timeline.push({
    timeline: [fixation, trial, feedback],
    timeline_variables: test_stimuli
});

let sona_id = jsPsych.data.urlVariables()['sona_id'];

jsPsych.init({
    timeline: timeline,
    exclusions: {
      min_width: image_dimensions.scaled[0]+100,
      min_height: image_dimensions.scaled[1]+100
    },
    on_finish: function(data){
      window.location.assign("https://ucdavis.sona-systems.com/webstudy_credit.aspx?experiment_id=2801&credit_token=0c619d0a40f84e1c953f76e325c494c4&survey_code="+sona_id)
    	  
  	}
});