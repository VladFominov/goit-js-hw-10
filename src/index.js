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
    <ul class="country-jslist">
    <li class="country-item"><img src="${flags.svg}" width=40, height=25 alt="Flag of ${name.official}">
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
        <ul class="countryinfo-list">
        <li class="countryinfo-item__name"><img src="${svg}" alt="flags" width=20, height=15> ${official}</li>
        <li class="countryinfo-item">Capital: ${capital}<li>
        <li class="countryinfo-item">Population: ${population}<li>
        <li class="countryinfo-item">Languages: ${Object.values(languages)}<li>
        </ul>
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
    fetchCountries(value)
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



