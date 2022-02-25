Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/
    /* Change 2: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();
    /* Change 3: Defining and load required resources */
    var repo_site = "https://alanzhihaolu.github.io/changeBlindness/"
    var jslib_url = repo_site + "jspsych-6.3.1/";

    var cond = 1;

    // the below urls must be accessible with your browser
    // for example, https://kywch.github.io/jsPsych/jspsych.js
    var requiredResources = [
        jslib_url + "jspsych.js",
        jslib_url + "plugins/jspsych-cb-flicker.js",
        jslib_url + "plugins/jspsych-html-button-response.js",
        jslib_url + "plugins/jspsych-html-keyboard-response.js",
        jslib_url + "plugins/jspsych-preload.js",
        repo_site + "FChange/fcb02/main/Input/delay" + cond + ".js",
        repo_site + "FChange/fcb02/main/Input/input.js",
        repo_site + "FChange/fcb02/main/Code/feature-change-blindness-02_main.js"
    ];

    function loadScript(idx) {
        console.log("Loading ", requiredResources[idx]);
        jQuery.getScript(requiredResources[idx], function () {
            if ((idx + 1) < requiredResources.length) {
                loadScript(idx + 1);
            } else {
                console.log(this)
                initExp();
            }
        });
    }
    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }
    /* Change 4: Appending the display_stage Div using jQuery */
    // jQuery is loaded in Qualtrics by default
    jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
    jQuery("<div id = 'display_stage'></div>").appendTo('body');
    var sbj_id = "${e://Field/id}";
    function initExp() {
        jsPsych.init({
            timeline: timeline,
            display_element: 'display_stage',
            exclusions: {
                min_width: image_dimensions.scaled[0]+100,
                min_height: image_dimensions.scaled[1]+100
            },

            /* Change 6: Adding the clean up and continue functions.*/
            on_finish: function (data) {
                jsPsych.data.addProperties({sbj_id: sbj_id, cond: cond});
                save_data_json();
                // clear the stage
                jQuery('#display_stage').remove();
                jQuery('#display_stage_background').remove();

                // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
                qthis.clickNextButton();
            }
        });
    }
});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});