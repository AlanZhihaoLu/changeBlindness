var images = [
    test_stimuli.map(a => a.first_image),
    test_stimuli.map(a => a.second_image)];

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
    stimulus: "<p>Try to spot the difference between two pictures!" +
    "<br>The pictures are identical except for one difference." +
    "<br>Try to spot it and click on it as fast as you can!</p>",
    choices: ["Let's try it out"]
};
timeline.push(introduction);

var trial = {
    type: 'side-by-side-differences',
    first_image: jsPsych.timelineVariable('first_image'),
    second_image: jsPsych.timelineVariable('second_image'),
    patches: jsPsych.timelineVariable('patches'),
    trial_duration: jsPsych.timelineVariable('duration'),
    image_dimensions: image_dimensions
};

var feedback = {
    type: "html-button-response",
    stimulus: function() {
        var last_trial_rt = jsPsych.data.get().last(1).values()[0].rt;
        if (last_trial_rt===null) {
            return "<h3>Too slow... Try to be faster!</h3>"
        } else {
            return "<h3>Nice Job!</h3>"
        }
    },
    choices: ["Thanks, let's see the next pair"]
};
timeline.push({
    timeline: [trial, feedback],
    timeline_variables: test_stimuli
});

var end_of_demo = {
    type: "html-button-response",
    stimulus: "<h3>I love your enthusiasm, but it's the end of the demo. Check back later for a full version!</h3>",
    choices: ["Ugh, fine. [ends the demo]"]
};
timeline.push(end_of_demo);