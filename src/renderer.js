const textarea = document.querySelector('textarea');
const plusButton = document.getElementById('btn1');
const minusButton = document.getElementById('btn2');
const saveButton = document.getElementById('btn3');

let defaultFontSize = 20;

plusButton.addEventListener('click', () => {
  defaultFontSize += 5;
  textarea.style.fontSize = `${defaultFontSize}px`;
});

minusButton.addEventListener('click', () => {
  defaultFontSize -= 5;
  textarea.style.fontSize = `${defaultFontSize}px`;
});

saveButton.addEventListener('click', () => {
  let text = textarea.value;
  console.log(text);
  window.electronAPI.saveText(text);
});

window.electronAPI.savedFileStatus((event, status) => {
  if (status === 'success') {
    console.log('note saved successfully');
    textarea.style.backgroundColor = '#B2FF99';
  } else {
    console.log('error saving text');
    textarea.style.backgroundColor = '#FF8989';
  }

  setTimeout(() => {
    textarea.style.backgroundColor = '';
  }, 250);
});
