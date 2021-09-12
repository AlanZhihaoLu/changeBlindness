/**
 * jspsych-side-by-side-differences
 * 
 * AZL 9/1/2021: Wrote it
 *
 * plugin for running side-by-side change detection task
 *
 **/

jsPsych.plugins["side-by-side-differences"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "side-by-side-differences",
    parameters: {
      first_image: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'First image',
        default: undefined,
        description: 'Path to first image.'
      },
      second_image: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Second image',
        default: undefined,
        description: 'Path to second image.'
      },
      patches: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Patches',
        default: undefined,
        description: 'Target patch locations.'
      },
      image_dimensions: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Image dimensions',
        default: { 
          original: [1024, 768],
          scaled: [500, 375]
        },
        description: 'Specify original and scaled image dimensions.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var response = {
      rt: null
    }

    var scale_ratio = trial.image_dimensions.scaled[0] / trial.image_dimensions.original[0];

    trial.patches.x.forEach((element, i) => {
      trial.patches.x[i] = element * scale_ratio;
    });

    trial.patches.y.forEach((element, i) => {
      trial.patches.y[i] = element * scale_ratio;
    });

    trial.patches.rad.forEach((element, i) => {
      trial.patches.rad[i] = element * scale_ratio;
    })

    var stimulus = '<div class="image-stimuli">' + 
      `<img id='image1' src=${trial.first_image} alt="First Image" width="${trial.image_dimensions.scaled[0]}" height="${trial.image_dimensions.scaled[1]}">` + 
      `<img id='image2' src=${trial.second_image} alt="First Image" width="${trial.image_dimensions.scaled[0]}" height="${trial.image_dimensions.scaled[1]}" style="position:relative;margin-left:10px">` +
      '</div>';

    // Taken from https://www.chestysoft.com/imagefile/javascript/get-coordinates.asp
    function FindPosition(oElement) {
      if(typeof( oElement.offsetParent ) != "undefined") {
        for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
          posX += oElement.offsetLeft;
          posY += oElement.offsetTop;
        }
        return [ posX, posY ];
      } else {
        return [ oElement.x, oElement.y ];
      }
    }

    display_element.innerHTML = stimulus;

    var image_one = display_element.querySelector('#image1');
    var image_two = display_element.querySelector('#image2');

    var image1_pos = FindPosition(image_one);
    var image2_pos = FindPosition(image_two);

    startTime = performance.now();

    function isTarget(PosX, PosY, patches) {
      for (let i = 0; i < patches.y.length; i++) {
        if (((PosX - patches.x[i])**2 + (PosY - patches.y[i])**2)**0.5 < patches.rad[i]) {
          return true
        }
      }
      return false
    };

    image_one.addEventListener('mousedown', function(e) {
      if (e.pageX || e.pageY) {
        PosX = e.pageX;
        PosY = e.pageY;
      }
      else if (e.clientX || e.clientY) {
        PosX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        PosY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
      PosX = PosX - image1_pos[0];
      PosY = PosY - image1_pos[1];
      var hit = isTarget(PosX, PosY, trial.patches)
      if (hit) {
        var info = {};
        info.rt = performance.now() - startTime;
        after_response(info);
      }
    });

    image_two.addEventListener('mousedown', function(e) {
      if (e.pageX || e.pageY) {
        PosX = e.pageX;
        PosY = e.pageY;
      }
      else if (e.clientX || e.clientY) {
        PosX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        PosY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
      PosX = PosX - image2_pos[0];
      PosY = PosY - image2_pos[1];
      var hit = isTarget(PosX, PosY, trial.patches)
      if (hit) {
        var info = {};
        info.rt = performance.now() - startTime;
        after_response(info);
      }
    });

    if(trial.trial_duration !== null){
      jsPsych.pluginAPI.setTimeout(endTrial, trial.trial_duration);
    }

    function endTrial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        rt: response.rt
      };

      // clear the display
      display_element.innerHTML = '';

      // display_element.innerHTML = `${5000 - response.rt} points`

      // move on to the next trial
      jsPsych.finishTrial(trial_data);

    };

    // function to handle responses by the subject
    function after_response(info) {

			// only record first response
      response = response.rt == null ? info : response;

      if (trial.response_ends_trial) {
        endTrial();
      }
    };

  };

  return plugin;
})();
