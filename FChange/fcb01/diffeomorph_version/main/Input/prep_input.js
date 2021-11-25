img_src = 'https://alanzhihaolu.github.io/changeBlindness/FChange/fcb01/diffeomorph_version/main/Input/fullsetimages/'

function process_input(raw_stimuli, img_src) {
    var test_stimuli = [];
    var i = 0;
    while (i < raw_stimuli.length) {
        var current = raw_stimuli[i];
        var x = [parseInt(current.x)];
        var y = [parseInt(current.y)];
        var rad = [parseFloat(current.rad)];
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

var test_stimuli = process_input(raw_stimuli, img_src + 'test/');

var mask_stimulus = img_src + 'mask/gray.png';

var example_stimulus = [
  {
    "x": 945,
    "y": 231,
    "first_image": "example_a.jpg",
    "second_image": "example_b.jpg",
    "rad": 43.5,
    "delay1": 1,
    "delay2": 1,
    "delay3": 1,
    "delay4": 1,
    "delay5": 1
  },
  {
    "x": 894,
    "y": 231,
    "first_image": "example_a.jpg",
    "second_image": "example_b.jpg",
    "rad": 43.5,
    "delay1": 1,
    "delay2": 1,
    "delay3": 1,
    "delay4": 1,
    "delay5": 1
  }
]

var example_stimulus = process_input(example_stimulus, img_src + 'demo/')