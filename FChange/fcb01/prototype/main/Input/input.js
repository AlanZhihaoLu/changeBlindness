var raw_stimuli = [
    {
        "first_image": "Scene1_CON_w_visual.png",
        "second_image": "Scene1_SEM_w_visual.png",
        "x": 800,
        "y": 365,
        "rad": 43.5
    },
    {
        "first_image": "Scene1_CON_w_visual.png",
        "second_image": "Scene1_SEM_w_visual.png",
        "x": 760,
        "y": 365,
        "rad": 43.5
    },
    {
        "first_image": "Scene1_CON_w_visual.png",
        "second_image": "Scene1_SEM_w_visual.png",
        "x": 760,
        "y": 405,
        "rad": 43.5
    },
    {
        "first_image": "Scene1_CON_w_visual.png",
        "second_image": "Scene1_SEM_w_visual.png",
        "x": 800,
        "y": 405,
        "rad": 43.5
    },
    {
        "first_image": "Scene1_CON.png",
        "second_image": "Scene1_SEM.png",
        "x": 800,
        "y": 365,
        "rad": 43.5
    },
    {
        "first_image": "Scene1_CON.png",
        "second_image": "Scene1_SEM.png",
        "x": 760,
        "y": 365,
        "rad": 43.5
    },
    {
        "first_image": "Scene1_CON.png",
        "second_image": "Scene1_SEM.png",
        "x": 760,
        "y": 405,
        "rad": 43.5
    },
    {
        "first_image": "Scene1_CON.png",
        "second_image": "Scene1_SEM.png",
        "x": 800,
        "y": 405,
        "rad": 43.5
    },
    {
        "first_image": "Scene2_CON.png",
        "second_image": "Scene2_SEM.png",
        "x": 930,
        "y": 490,
        "rad": 102.5
    }
]

// img_src = 'https://alanzhihaolu.github.io/fcb01/Images/';
img_src = '../Images/'

function process_input(raw_stimuli, img_src) {
    var test_stimuli = [];
    var i = 0;
    while (i < raw_stimuli.length) {
        var current = raw_stimuli[i];
        var x = [current.x];
        var y = [current.y];
        var rad = [current.rad];
        var j = i + 1;
        while (j < raw_stimuli.length && current.first_image === raw_stimuli[j].first_image) {
            x.push(raw_stimuli[j].x);
            y.push(raw_stimuli[j].y);
            rad.push(raw_stimuli[j].rad);
            j += 1;
        }
        current.patches = {
            x: x,
            y: y,
            rad: rad
        }
        delete current.x;
        delete current.y;
        delete current.rad;
        current.first_image = img_src + current.first_image;
        current.second_image = img_src + current.second_image;
        test_stimuli.push(current);
        i = j;
    }
    return test_stimuli;
}

test_stimuli = process_input(raw_stimuli, img_src);