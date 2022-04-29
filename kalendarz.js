let msc = 0, rok = 2021;
let klik = null;
let wizyty = localStorage.getItem('wizyty') ? JSON.parse(localStorage.getItem('wizyty')) : [];
let obiekt_dzien;
let wizyta;


const kalendarz = document.getElementById('kalendarz');

let imie = document.getElementById('pole_imie');
let nazwisko = document.getElementById('pole_nazwisko');
let tel = document.getElementById('pole_tel');

class Dzien {
    constructor(data, umowione, wolne_godz) {
        this.data = data;
        this.umowione = umowione;
        this.wolne_godz = wolne_godz;
    }
    dodaj_wizyte(wizyta) {
        this.umowione.push(wizyta);
        this.wolne_godz.splice(this.wolne_godz.indexOf(wizyta.godzina), 1);
        this.umowione.sort(function (a, b) {
            if (a.godzina < b.godzina) return -1;
            if (a.godzina > b.godzina) return 1;
            else return 0;
        });
    }
}
class Wizyta {
    constructor(godzina, imie, nazwisko, tel) {
        this.godzina = godzina;
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.tel = tel;
    }
}

function miesiac(m) {
    let miesiac;
    switch (m) {
        case 0:
            miesiac = 'Styczen'; break;
        case 1:
            miesiac = 'Luty'; break;
        case 2:
            miesiac = 'Marzec'; break;
        case 3:
            miesiac = 'Kwiecien'; break;
        case 4:
            miesiac = 'Maj'; break;
        case 5:
            miesiac = 'Czerwiec'; break;
        case 6:
            miesiac = 'Lipiec'; break;
        case 7:
            miesiac: 'Sierpien'; break;
        case 8:
            miesiac = 'Wrzesien'; break;
        case 9:
            miesiac = 'Pazdziernik'; break;
        case 10:
            miesiac = 'Listopad'; break;
        case 11:
            miesiac = 'Grudzien'; break;
        default: break;
    }
    document.getElementById('miesiac').innerHTML = miesiac + `, ${rok}`;
    load();
}
miesiac(msc);
function msc_plus() {
    msc++;
    if (msc > 11) {
        msc = 0;
        rok++;
    }
    miesiac(msc);
}
function msc_minus() {
    msc--;
    if (msc < 0) {
        msc = 11;
        rok--;
    }
    miesiac(msc);
}
document.getElementById('msc_minus').addEventListener("click", msc_minus);
document.getElementById('msc_plus').addEventListener("click", msc_plus);

function otworz_okienko(dat) {
    klik = dat;
    obiekt_dzien = wizyty.find(e => e.data === klik);
    document.getElementById('okienko_nowa_wizyta').style.display = 'block';
    document.getElementById('tytul_okienka').innerHTML = dat;
    let i;
    if (obiekt_dzien) {}
    else {
        let u = [], w=[8,9,10,11,12,13,14,15];
        obiekt_dzien = new Dzien(dat, u, w);
    }
    for (i = 0; i < obiekt_dzien.wolne_godz.length; i++) {
        const opcja = document.createElement('input');
        opcja.type = 'radio';
        opcja.setAttribute("name", "godzina");
        opcja.setAttribute("id", `${obiekt_dzien.wolne_godz[i]}`);
        const label = document.createElement('label');
        label.setAttribute("for", `${obiekt_dzien.wolne_godz[i]}`);
        label.innerHTML = `${obiekt_dzien.wolne_godz[i]}:00`;
        document.getElementById('godzina_wizyty').appendChild(label);
        document.getElementById('godzina_wizyty').appendChild(opcja);
    }
    if (i === 0) {
        const info = document.createElement('p');
        info.setAttribute("id", "info");
        info.innerHTML = 'Brak wolnych godzin';
        documentgetElementById('godzina_wizyty').appendChild(info);
    }
    BackDrop.style.display = 'block';
}
function load() {
    kalendarz.innerText = '';
    const ilosc_dni = new Date(rok, msc + 1, 0).getDate();
    const pierwszy_dzien = new Date(rok, msc, 1);
    const liczba_pustych = (pierwszy_dzien.getDay() - 1) % 7;
    for (let i = 1; i <= liczba_pustych + ilosc_dni; i++) {
        const dzien = document.createElement('div');
        dzien.classList.add('dzien');
        const data = `${i-liczba_pustych}/${msc+1}/${rok}`;
        if (i > liczba_pustych) {
            dzien.innerText = i - liczba_pustych;
            for (let j = 0; j < wizyty.length; j++) {
                if (wizyty[j].data === data) {
                    const helper_div = document.createElement('div');
                    for (let k = 0; k < wizyty[j].umowione.length; k++) {
                        const umowione_div = document.createElement('div');
                        umowione_div.classList.add('wizyta');
                        umowione_div.innerText = `${wizyty[j].umowione[k].godzina}:00 ${wizyty[j].umowione[k].nazwisko}`;
                        helper_div.appendChild(umowione_div);
                    }
                    dzien.appendChild(helper_div);
                }
            }
            dzien.addEventListener('click', () => otworz_okienko(data));
        } else {
            dzien.classList.add('puste');
        }
        kalendarz.appendChild(dzien);
    }
}
function zamknij_okienko() {
    document.getElementById('okienko_nowa_wizyta').style.display = 'none';
    document.getElementById('BackDrop').style.display = 'none';
    imie.value = '';
    nazwisko.value = '';
    tel.value = '';
    document.getElementById('formularz').removeChild(document.getElementById('godzina_wizyty'));
    let godz_wizyty = document.createElement('div');
    godz_wizyty.setAttribute("id", "godzina_wizyty");
    document.getElementById("formularz").insertBefore(godz_wizyty, document.getElementById("dane"));
    klik = null;
    obiekt_dzien = null;
    load();
}
function dod_wizyte() {
    let i;
    if (imie.value && nazwisko.value && tel.value) {
        for (i = 0; i < obiekt_dzien.wolne_godz.length; i++) {
            if (document.getElementById(`${obiekt_dzien.wolne_godz[i]}`).checked) {
                wizyta = new Wizyta(obiekt_dzien.wolne_godz[i], imie.value, nazwisko.value, tel.value);
                break;
            }
        }
        if (i === obiekt_dzien.wolne_godz.length && i!=0) {
            alert("Nalezy wybrac godzine!");
        }
        else if (obiekt_dzien.wolne_godz.length === 0) {}
        else {
            obiekt_dzien.dodaj_wizyte(wizyta);
            if(obiekt_dzien.umowione.length === 1) wizyty.push(obiekt_dzien);
            localStorage.setItem('wizyty', JSON.stringify(wizyty));
            zamknij_okienko();
        }
    }
    else alert("Prosze uzupelnic wszystkie pola");
}


document.getElementById("anuluj").addEventListener('click', zamknij_okienko);
load();

