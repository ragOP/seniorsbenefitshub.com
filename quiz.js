// /* global document, window, Typed, Glide, gtag, setTimeout, console */

// (() => {
//   /**
//    * Configuration constants for the quiz
//    * @type {Object}
//    */
//   const CONFIG = {
//     COUNTDOWN_DURATION: 2 * 60, // 2 minutes in seconds
//     LOADING_DELAY: 2500, // 2.5 seconds
//     TYPED_OPTIONS: {
//       strings: ["Confirming your eligibility..."],
//       backDelay: 1000,
//       backSpeed: 0,
//       typeSpeed: 5,
//       showCursor: false,
//     },
//     GLIDE_OPTIONS: {
//       swipeThreshold: false,
//       dragThreshold: false,
//       rewind: false,
//       keyboard: false,
//     },
//     REDIRECT_URLS: {
//       NO_RESPONSE: 'https://tracking.smartestlifestyletrends.com/f1b7e1a0-acd7-47ce-83a9-deff0d2f812a',
//       UNQUALIFIED_RESPONSE: 'https://tracking.smartestlifestyletrends.com/f1b7e1a0-acd7-47ce-83a9-deff0d2f812a'
//     }
//   };

//   /**
//    * Google Analytics event names
//    * @type {Object}
//    */
//   const GA_EVENTS = {
//     QUIZ_INIT: 'Life PPC LP1 Quiz initialized',
//     STEP_COMPLETE: 'Life PPC LP1 Quiz - Step {step} Completed',
//     CALL_BUTTON_CLICK: 'Life PPC LP1 Quiz - Click Call Button',
//     PHONE_NUMBER_CLICK: 'Life PPC LP1 Quiz - Click Phone Number',
//     SHOW_PHONE: 'Life PPC LP1 Quiz - Show Phone Number',
//     NO_IVR_NUMBER: 'Life PPC LP1 Quiz - Could not retrieve IVR number',
//     UNQUALIFIED_RESPONSE: 'Life PPC LP1 Quiz - Unqualified Response'
//   };

//   /**
//    * DOM element selectors
//    * @type {Object}
//    */
//   const SELECTORS = {
//     CAROUSEL: '.glide',
//     LOADING: '#loading',
//     LOADING_ALERT: '#loading .alert',
//     CALL_BUTTON: '#call-btn',
//     PHONE_NUMBERS: '.phone-number',
//     QUIZ_HEADER: '#quiz-header',
//     RESULTS: '#results',
//     MINUTES: '#minutes',
//     SECONDS: '#seconds',
//     SLIDES: '.glide__slide',
//     BUTTONS: '.glide__slide .btn'
//   };

//   /**
//    * Updates the countdown timer display
//    * @param {number} duration - Remaining time in seconds
//    * @param {HTMLElement} minutesElement - Minutes display element
//    * @param {HTMLElement} secondsElement - Seconds display element
//    * @returns {void}
//    */
//   const updateCountdown = (duration, minutesElement, secondsElement) => {
//     const minutes = Math.floor(duration / 60);
//     const seconds = duration % 60;

//     minutesElement.textContent = minutes;
//     secondsElement.textContent = seconds < 10 ? `0${seconds}` : seconds;

//     if (duration > 0) {
//       setTimeout(() => updateCountdown(duration - 1, minutesElement, secondsElement), 1000);
//     }
//   };

//   /**
//    * Starts the countdown timer
//    * @returns {void}
//    */
//   const startCountdown = () => {
//     const minutesElement = document.querySelector(SELECTORS.MINUTES);
//     const secondsElement = document.querySelector(SELECTORS.SECONDS);

//     if (!minutesElement || !secondsElement) {
//       console.error('Countdown elements not found');
//       return;
//     }

//     updateCountdown(CONFIG.COUNTDOWN_DURATION, minutesElement, secondsElement);
//   };

//   /**
//    * Updates phone number elements in the DOM
//    * @param {Object} response - IVR response containing phone number data
//    * @returns {void}
//    */
//   const updatePhoneElements = (response) => {
//     if (!response) return;

//     // Update call button
//     const callButton = document.querySelector(SELECTORS.CALL_BUTTON);
//     if (callButton) {
//       callButton.setAttribute('href', `tel:${response.phone.html}`);
//       callButton.addEventListener('click', () => gtag('event', GA_EVENTS.CALL_BUTTON_CLICK));
//     }

//     // Update phone number elements
//     const phoneElements = document.querySelectorAll(SELECTORS.PHONE_NUMBERS);
//     phoneElements.forEach((element) => {
//       const link = document.createElement('a');
//       link.href = `tel:${response.phone.html}`;
//       link.textContent = response.phone.formatted;
//       element.appendChild(link);
//       element.addEventListener('click', () => gtag('event', GA_EVENTS.PHONE_NUMBER_CLICK));
//     });
//   };

//   /**
//    * Handles the end of the carousel interaction
//    * @async
//    * @returns {Promise<void>}
//    */
//   const handleCarouselEnd = async () => {
//     // Show loading screen
//     const carousel = document.querySelector(SELECTORS.CAROUSEL);
//     const loading = document.querySelector(SELECTORS.LOADING);

//     if (!carousel || !loading) {
//       console.error('Required elements not found');
//       return;
//     }

//     carousel.classList.add('d-none');
//     loading.classList.remove('d-none');

//     // Initialize loading message
//     const typed = new Typed(SELECTORS.LOADING_ALERT, CONFIG.TYPED_OPTIONS);

//     // Get and update phone number
//     const response = await window.aquavida.ivr.getPhoneNumber();
//     if (!response) {
//       gtag('event', GA_EVENTS.NO_IVR_NUMBER);
//       window.location.assign(CONFIG.REDIRECT_URLS.NO_RESPONSE);
//       return;
//     }
//     updatePhoneElements(response);

//     // Show results after delay
//     setTimeout(() => {
//       loading.classList.add('d-none');

//       gtag('event', GA_EVENTS.SHOW_PHONE);
//       document.querySelector(SELECTORS.QUIZ_HEADER).classList.add('d-none');
//       document.querySelector(SELECTORS.RESULTS).classList.remove('d-none');
//       typed.destroy();
//       startCountdown();
//     }, CONFIG.LOADING_DELAY);
//   };

//   /**
//    * Initializes the quiz when the DOM is loaded
//    * @returns {void}
//    */
//   const initializeQuiz = () => {
//     // Initialize carousel
//     const glide = new Glide(SELECTORS.CAROUSEL, CONFIG.GLIDE_OPTIONS).mount();
//     gtag('event', GA_EVENTS.QUIZ_INIT);

//     // Set up button handlers
//     const slides = document.querySelectorAll(SELECTORS.SLIDES);
//     const buttons = document.querySelectorAll(SELECTORS.BUTTONS);
//     const formValues = {};

//     buttons.forEach(button => {
//       button.addEventListener('click', () => {
//         const slideNumber = glide.index + 1;
//         const isYes = button.value.toLowerCase() === 'yes';

//         gtag('event', GA_EVENTS.STEP_COMPLETE.replace('{step}', slideNumber));
//         formValues[button.name] = isYes;

//         if (slideNumber < slides.length) {
//           glide.go('>');
//         } else {
//           // If any answer was no, redirect after loading
//           if (!isYes || Object.values(formValues).includes(false)) {
//             gtag('event', GA_EVENTS.UNQUALIFIED_RESPONSE);
//             setTimeout(() => {
//               window.location.assign(CONFIG.REDIRECT_URLS.UNQUALIFIED_RESPONSE);
//             }, CONFIG.LOADING_DELAY);
//           }
//           handleCarouselEnd();
//         }
//       });
//     });
//   };

//   // Initialize quiz when DOM is ready
//   document.addEventListener('DOMContentLoaded', initializeQuiz);
// })();