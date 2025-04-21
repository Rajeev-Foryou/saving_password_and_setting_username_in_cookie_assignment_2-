const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

function store(key, value) {
  localStorage.setItem(key, value);
}

function retrieve(key) {
  return localStorage.getItem(key);
}

function getRandomArbitrary(min, max) {
  let cached = Math.random() * (max - min) + min;
  cached = Math.floor(cached);
  store('original', cached); // store original number for testing
  return cached.toString();
}

function clear() {
  localStorage.clear();
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

async function getSHA256Hash() {
  let cached = retrieve('sha256');
  if (cached) {
    return cached;
  }

  const randomNum = getRandomArbitrary(MIN, MAX);
  const hashed = await sha256(randomNum);
  store('sha256', hashed);
  return hashed;
}

async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

async function test() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.innerHTML = '💡 not 3 digits';
    resultView.classList.remove('hidden');
    return;
  }

  const hasedPin = await sha256(pin);
  if (hasedPin === sha256HashView.innerHTML) {
    resultView.innerHTML = '🎉 success';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ failed';
  }
  resultView.classList.remove('hidden');
}

pinInput.addEventListener('input', (e) => {
  const { value } = e.target;
  pinInput.value = value.replace(/\D/g, '').slice(0, 3);
});

document.getElementById('check').addEventListener('click', test);

main();