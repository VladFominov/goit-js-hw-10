import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const inputRef = document.querySelector('#search-box');
console.log(inputRef);
const countryList = document.querySelector('.country-list');
console.log(countryList);
const countryInfo = document.querySelector('.country-info');
console.log(countryInfo);

const DEBOUNCE_DELAY = 300;

const markupCountryList = (countries = []) => {
    const markup = countries
      .map(({ name, flags }) => {
        return `
    <ul>
    <li><img src="${flags.svg}" width=40, height=25 alt="Flag of ${name.official}">
    <h2>${name.official}</h2>
    </li>
    </ul>
    `;
      })
      .join('');
    countryList.innerHTML = markup;
}

const markupCountryInfo = (country) => {
    const markup = country
      .map(
        ({
          name: { official },
          capital,
          population,
          flags: { svg },
          languages,
        }) => `<div>
        <p>name.official:${official}</p>
        <p>capital:${capital}</p>
        <p>population:${population}</p>
        <img src="${svg}" alt="flags" width=40, height=25>
        <p>languages:${Object.values(languages)}</p>
        </div>`
      )
      .join('');
    countryInfo.innerHTML = markup;
};


inputRef.addEventListener('input', debounce(e => {
    countryInfo.textContent = '';
    countryList.textContent = '';
  const value = e.target.value.trim()
  if (!value) return;
    fetchCountries(e.target.value)
      .then(data => {
        if (data.length === 1) markupCountryInfo(data);
        else if (data.length <= 10) markupCountryList(data);
        else
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
      })
      .catch(error =>
        Notify.failure('Oops, there is no country with that name')
      );
}, DEBOUNCE_DELAY));



// let test = [
//   {
//     name: {
//       common: 'North Korea',
//       official: "Democratic People's Republic of Korea",
//       nativeName: {
//         kor: { official: '조선민주주의인민공화국', common: '조선' },
//       },
//     },
//     capital: ['Pyongyang'],
//     altSpellings: [
//       'KP',
//       "Democratic People's Republic of Korea",
//       'DPRK',
//       '조선민주주의인민공화국',
//       'Chosŏn Minjujuŭi Inmin Konghwaguk',
//       "Korea, Democratic People's Republic of",
//       '북한',
//       '북조선',
//     ],
//     languages: { kor: 'Korean' },
//     population: 25778815,
//   },
//   {
//     name: {
//       common: 'United Kingdom',
//       official: 'United Kingdom of Great Britain and Northern Ireland',
//       nativeName: {
//         eng: {
//           official: 'United Kingdom of Great Britain and Northern Ireland',
//           common: 'United Kingdom',
//         },
//       },
//     },
//     capital: ['London'],
//     altSpellings: ['GB', 'UK', 'Great Britain'],
//     languages: { eng: 'English' },
//     population: 67215293,
//   },
//   {
//     name: {
//       common: 'Ukraine',
//       official: 'Ukraine',
//       nativeName: { ukr: { official: 'Україна', common: 'Україна' } },
//     },
//     capital: ['Kyiv'],
//     altSpellings: ['UA', 'Ukrayina'],
//     languages: { ukr: 'Ukrainian' },
//     population: 44134693,
//   },
// ];

