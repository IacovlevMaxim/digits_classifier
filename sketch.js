//Для каждого класса, создаём массив, который будет содержать изображения только для этого класса
let zeros = [],
    ones = [],
    twos = [],
    threes = [],
    fours = [],
    fives = [],
    sixs = [],
    sevens = [],
    eights = [],
    nines = [],
    plus = [],
    minus = [];

//Переменная для нейронной сети
let shapeClassifier;

//Константа размера картинок
const size = 28;
const loadSize = 99;
let counter = 0;

const path = "data";

function preload() {
  for (let i = counter; i < ((counter + 1) * loadSize); i++) {
    zeros[i] = (loadImage(`${path}/0/0-${i}.png`));
    ones.push(loadImage(`${path}/1/1-${i}.png`));
    twos.push(loadImage(`${path}/2/2-${i}.png`));
    threes.push(loadImage(`${path}/3/3-${i}.png`));
    fours.push(loadImage(`${path}/4/4-${i}.png`));
    fives.push(loadImage(`${path}/5/5-${i}.png`));
    sixs.push(loadImage(`${path}/6/6-${i}.png`));
    sevens.push(loadImage(`${path}/7/7-${i}.png`));
    eights.push(loadImage(`${path}/8/8-${i}.png`));
    nines.push(loadImage(`${path}/9/9-${i}.png`));
    plus.push(loadImage(`${path}/+/+-${i}.png`));
    minus.push(loadImage(`${path}/-/--${i}.png`));
    
    // pushImage(`${path}/0/0-${i}.png`, zeros);
    // pushImage(`${path}/1/1-${i}.png`, ones);
    // pushImage(`${path}/2/2-${i}.png`, twos);
    // pushImage(`${path}/3/3-${i}.png`, threes);
    // pushImage(`${path}/4/4-${i}.png`, fours);
    // pushImage(`${path}/5/5-${i}.png`, fives);
    // pushImage(`${path}/6/6-${i}.png`, sixs);
    // pushImage(`${path}/7/7-${i}.png`, sevens);
    // pushImage(`${path}/8/8-${i}.png`, eights);
    // pushImage(`${path}/9/9-${i}.png`, nines);
    // pushImage(`${path}/-/--${i}.png`, minus);
    // pushImage(`${path}/+/+-${i}.png`, nines);
  }
  console.log(zeros);
  // loadImage(path, img => {
  //   arr.push(img);
  // })
}

function clearArrays() {
  zeros.clear();
  ones.clear();
  twos.clear();
  threes.clear();
  fours.clear();
  fives.clear();
  sixs.clear();
  sevens.clear();
  eights.clear();
  nines.clear();
  plus.clear();
  minus.clear();
}

function loadImages() {
  console.log(`loading from ${counter} to ${(counter + 1) * loadSize}`);
  
  console.log("loaded images!");
  console.log(zeros);
}

// function preload() {
//   loadImages();
// }

function setup() {
  createCanvas(400, 400);

  let options = {
    inputs: [size, size, 4],
    task: 'imageClassification',
    layers: [
      {
        type: 'conv2d',
        filters: 8,
        kernelSize: 5,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
      },
      {
        type: 'maxPooling2d',
        poolSize: [2, 2],
        strides: [2, 2],
      },
      {
        type: 'conv2d',
        filters: 16,
        kernelSize: 5,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
      },
      {
        type: 'maxPooling2d',
        poolSize: [2, 2],
        strides: [2, 2],
      },
      {
        type: 'flatten',
      },
      {
        type: 'dense',
        kernelInitializer: 'varianceScaling',
        activation: 'softmax',
      },
    ],
    learningRate: 0.1,
    debug: true
  };
  shapeClassifier = ml5.neuralNetwork(options);

  console.log("nn created! classifying images...");

  // for(let j = 0; j < 3; j++) {
  //   loadImages();
    for (let i = counter; i < ((counter + 1) * loadSize); i++) {
      classify(zeros[i], "0");
      classify(ones[i], "1");
      classify(twos[i], "2");
      classify(threes[i], "3");
      classify(fours[i], "4");
      classify(fives[i], "5");
      classify(sixs[i], "6");
      classify(sevens[i], "7");
      classify(eights[i], "8");
      classify(nines[i], "9");
      classify(minus[i], "-");
      classify(plus[i], "+");
    }
  //   clearArrays();
  //   counter++;
  // }
  console.log("images classified! normalizing data...");
  shapeClassifier.normalizeData();
  console.log("data normalized! training...");
  shapeClassifier.train({ epochs: 70 }, finishedTraining);
}

function classify(image, label) {
  image.resize(size, size);

  // if(label == "+" || label == "-") {
  //   image.filter(INVERT);
  // }

  shapeClassifier.addData({ image: image }, { label: label });
}

function finishedTraining() {
  console.log('finished training!');
  shapeClassifier.save();
}