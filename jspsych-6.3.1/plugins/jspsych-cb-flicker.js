/**
 * jspsych-cb-flicker
 * 
 * AZL 9/2/2021: Wrote it
 *
 * plugin for running flicker change detection task
 *
 **/

 jsPsych.plugins['cb-flicker'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'cb-flicker',
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
      mask: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Mask',
        default: undefined,
        description: 'Path to mask image.'
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
      delay_change_onset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Delay change onset",
        default: null,
        description: "How long to delay onset of change."
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEY,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
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

    var trial_data = {
      rt: null,
      PosX: null,
      PosY: null,
      hit: null
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
    });

    var img_parent_style = "position:relative;top:0;left:0;"
    var img1_style = "position:relative;top:0;left:0;";
    var mask_style = "position:absolute;top:0;left:0;";
    var img2_style = "position:absolute;top:0;left:0;";

    var second_image_src = trial.delay_change_onset === null ? trial.second_image : trial.first_image;

    var stimulus = `<div class="image-stimuli" style=${img_parent_style}>` + 
      `<img id='image1' src=${trial.first_image} alt="First Image" width="${trial.image_dimensions.scaled[0]}" height="${trial.image_dimensions.scaled[1]}" style=${img1_style}>` + 
      `<img id='mask' src=${trial.mask} alt="First Image" width="${trial.image_dimensions.scaled[0]}" height="${trial.image_dimensions.scaled[1]}" style=${mask_style}>` +
      `<img id='image2' src=${second_image_src} alt="First Image" width="${trial.image_dimensions.scaled[0]}" height="${trial.image_dimensions.scaled[1]}" style=${img2_style}>` +
      '</div>';

    display_element.innerHTML = stimulus;

    document.body.style.cursor = 'none';

    // flicker implementation

    var maskDur = 80;
    var imageDur = 240;
    var image2 = document.querySelector('#image2');
    var mask = document.querySelector('#mask');
    image2.style.opacity = 0;
    mask.style.opacity = 0;

    function showHide(scenario) {
        if (scenario === 2) {
            mask.style.opacity = 1;
            image2.style.opacity = 0;
            return maskDur
        } else if (scenario === 3) {
            image2.style.opacity = 1;
            return imageDur
        } else if (scenario === 1) {
            mask.style.opacity = 0;
            return imageDur
        }
    }

    var scenarios = [1,2,3,2]

    var timeoutID;

    function changeImage(scenarios) {
        var scenario = scenarios.pop();
        timing = showHide(scenario);
        scenarios.unshift(scenario);
        timeoutID = setTimeout(()=>changeImage(scenarios),timing);
    }

    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    startTime = performance.now();
    changeImage(scenarios);
    
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

    function isTarget(PosX, PosY, patches) {
      for (let i = 0; i < patches.y.length; i++) {
        if (((PosX - patches.x[i])**2 + (PosY - patches.y[i])**2)**0.5 < patches.rad[i]) {
          return true
        }
      }
      return false
    };

    // function to handle responses by the subject
    function after_response(info) {

      // only record first response
      trial_data.rt = trial_data.rt == null ? info.rt : trial_data.rt;

      mask.style.opacity = 0;
      clearTimeout(timeoutID);

      display_element.innerHTML = '<p>Where is the change?</p>' + display_element.innerHTML + '<p>Please click on the location of the change.</p>';
      document.body.style.cursor = 'auto';

      var image2 = document.querySelector('#image2');
      var image2_pos = FindPosition(image2);

      image2.addEventListener('mousedown', function(e) {
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
        // only record first responses
        trial_data.PosX = trial_data.PosX === null ? PosX / scale_ratio : trial_data.PosX;
        trial_data.PosY = trial_data.PosY === null ? PosY / scale_ratio : trial_data.PosY;
        var hit = isTarget(PosX, PosY, trial.patches);
        trial_data.hit = trial_data.hit === null ? hit : trial_data.hit;

        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();

        // kill keyboard listeners
        if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }

        display_element.innerHTML = '';
        jsPsych.finishTrial(trial_data);
        
      });

    };

    // present change with delay if delay_change_onset is set
    if (trial.delay_change_onset !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        image2.src = trial.second_image;
      }, trial.delay_change_onset);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {

        // kill keyboard listeners
        if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }
        
        after_response({
          rt: null
        });
      }, trial.trial_duration);
    }

  };
  return plugin;
})();
