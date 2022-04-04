'use strict';
//НС - нейронная сеть
//НС, которую мы тренировали до этого
let shapeClassifier;

//"Холст" где пользователь может писать число
let canvas;

//Элемент HTML, где будет выводится число, предсказываемое нейронной сетью
let resultsDiv;

let board;
let boardDiv;

//Изображение, которое нейронная сеть будет обрабатывать
let inputImage;

//Изображение первой цифры *(или символа)
let firstDigit;

//Предсказываемая первая цифра *(или символ)
let f;

//Вспомогательная кнопка для очистки холста
let clearButton;

let enterButton;
let evalButton;
let deleteButton;

//Размер картинки, удобный для понимания НС (разрешение картинки, использованное для обучения)
const size = 28;

function setup() {
  //Создаём холст
  canvas = createCanvas(400, 400);
  
  //Настраиваем НС
  let options = {
    inputs: [size, size, 4],
    task: 'imageClassification'
  };
  
  //Создаём объект НС
  shapeClassifier = ml5.neuralNetwork(options);
  
  //Интерфейс
  background(0);
  createDiv().style('height', '25px');
  clearButton = createButton('clear');
  clearButton.mousePressed(function() {
    background(0);
  });
  enterButton = createButton('Enter');
  enterButton.mousePressed(() => {
    board += f;
    background(0);
  });
  evalButton = createButton('Evaluate');
  evalButton.mousePressed(evalPressed)
  deleteButton = createButton("Delete");
  deleteButton.mousePressed(() => {
    if(board.length > 0) {
      board = board.substring(0, board.length - 1);
    }
  })
  createDiv().style('height', '25px');
  resultsDiv = createDiv('loading model');
  boardDiv = createDiv("");
  inputImage = createGraphics(size, size);
  firstDigit = createGraphics(size, size);
  board = "";
  
  //Загружаем обученную НС
  const modelDetails = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin'
  };
  shapeClassifier.load(modelDetails, modelLoaded);
}

//Функция, которая запускается, когда модель загружена
function modelLoaded() {
  console.log('model ready!');
  classifyImage();
}

//Передаём холст нейронной сети для определения числа
function classifyImage() { 
  //Разделяем холст на две части как две отдельные цифры
  firstDigit.copy(canvas, 0, 0, width, height, 0, 0, size, size);

  //Передаём изображение НС
  shapeClassifier.classify({ image: firstDigit }, gotResults);
}

function gotResults(err, results) {
  //Проверяем если произошли какие-либо ошибки
  if(err) throw err;

  //Предсказанный класс
  let label = results[0].label;

  //Процент уверенности в выборе
  let confidence = nf(100 * results[0].confidence, 2, 1);

  //Вывод на страницу
  resultsDiv.html(`${label} ${confidence}%\n${results[1].label} ${nf(100 * results[1].confidence, 2, 1)}%`);
  boardDiv.html(board);

  //Присвоение текущей цифры или символа для дальнейшего возможного выведения на "доску"
  f = label;

  //Снова классифицируем изображение. Эта часть обеспечивает циркулярность программы
  classifyImage();
}

function draw() {
  //Если мышка нажата, рисуем белую линию
  if (mouseIsPressed) {
    strokeWeight(24);
    stroke(255);
    fill(255);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function evalPressed() {
  /** Записываем в try/catch блок, так как если введено математически неверное выражение,       * будет выброшена ошибка
   **/
  try {
    //Прибавляем результат eval(board) (решение примера) к концу выражения
    board += `=${eval(board)}`;
  } catch(ex) {
    /**Если программе не удастся выполнить операцию выше, программа перейдет к этому      
      * блоку. Выведем ошибку
     **/
    board += "\nОшибка: возможно математически неправильное выражение";
  }
}