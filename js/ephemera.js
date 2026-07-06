var ephemeraItems = [
	{
		id: 'lexia-to-perplexia-book',
		label: 'Lexia to Perplexia, Book',
		front: 'lexia-to-perplexia-front.png',
		back: 'lexia-to-perplexia-back.png',
		caption: 'The book edition of "Lexia to Perplexia" by Talan Memmott, dated 2025.'
	},
	{
		id: 'hyper-text-card',
		label: 'hyper_text',
		front: 'hyper_text_card-front.png',
		back: 'hyper_text_card-back.png',
		caption: 'The announcement card for the reading series held at the UCLA Hammer Museum in spring 2004, featuring Memmott and Noah Waldrip-Fruin.'
	},
	{
		id: 'hammer-museum',
		label: 'The Hammer Calendar',
		front: 'hammer-museum-booket-front.png',
		back: 'hammer-museum-booklet-back.png',
		caption: 'The printed calendar of the UCLA Hammer Museum events, which lists the hyper_text reading series.'
	},
	{
		id: 'cyberarts-festival-card',
		label: 'Boston Cyberarts Festival',
		front: 'cyberarts-festival-card-front.png',
		back: 'cyberarts-festival-card-back.png',
		caption: 'The announcement card for the Boston Cyberarts Festival, where Memmott performed at the Boston Public Library on April 25.'
	},
	{
		id: 'boston-cyberarts-booklet',
		label: 'The Boston Cyberarts Festival Program',
		front: 'boston-cyberarts-festival-front.png',
		back: 'boston-cyberarts-festival-back.png',
		inside: 'boston-cyberarts-festival-inside.png',
		caption: 'The Boston Cyberarts Festival program, listing Memmott\'s performance at the Boston T1 Party, with other electronic literature artists.'
	},
	{
		id: 'future-of-elit-card',
		label: 'The Future of Electronic Literature',
		front: 'future-of-elit-card.png',
		caption: 'The announcement card for The Future of Electronic Literature Symposium in May 2007 at the University of Maryland, College Park, where Memmott read from "Lexia to Perplexia" during the "Electric Hour."'
	},
	{
		id: 'elo-booklet',
		label: 'The State of the Arts Program',
		front: 'elo-booklet-front.png',
		back: 'elo-booklet-back.png',
		inside: 'elo-booklet-inside.png',
		caption: 'The printed program from the ELO\'s State of the Arts Conference held at UCLA in 2002. Memmott is listed as a panelist at the event on page 10 of the program.'
	},
	{
		id: 'elo-2001-awards-poster',
		label: 'ELO 2001 Competition for Fiction and Poetry',
		front: 'elo-2001-awards-poster.png',
		caption: 'The flyer promoting ELO\'s 2001 competition for fiction and poetry. Memmott was short-listed for his work, "Lexia to Perplexia," in the fiction category.'
	},
	{
		id: 'gig',
		label: 'GiG 2.0',
		front: 'gig-2.png',
		caption: 'The promotional flyer for GiG 2.0 that took place in December 2000 in Chicago, where Memmott presented his journal BeeHive.'
	},
	{
		id: 'elc',
		label: 'Electronic Literature Volume One',
		front: 'elc-1.png',
		caption: 'The ELC Volume 1 (2006) Announcement Card listing Talan Memmott among the artists featured in it.'
	}
];

var _grid = document.getElementById('ephemera-grid');
var _modal = document.getElementById('ep-modal');
var _modalInner = document.getElementById('ep-modal-inner');
var _modalImg = document.getElementById('ep-modal-img');
var _modalInfo = document.getElementById('ep-modal-info');
var _modalTitle = document.getElementById('ep-modal-title');
var _modalCaption = document.getElementById('ep-modal-caption');
var _modalViews = document.getElementById('ep-modal-views');
var _modalClose = document.getElementById('ep-modal-close');
var _activeItem = null;
var _activeSide = 'front';
var _sourceCard = null;
var _isFlipping = false;

function findItem(id) {
	for (var i = 0; i < ephemeraItems.length; i++) {
		if (ephemeraItems[i].id === id) return ephemeraItems[i];
	}
	return null;
}

function buildGrid() {
	_grid.innerHTML = ephemeraItems.map(function (item) {
		return '<li class="swiper-slide ep-card-wrap">' +
			'<button class="ep-card" data-id="' + item.id + '" aria-label="View ' + item.label + '">' +
			'<div class="ep-card-img-wrap">' +
			'<img class="ep-card-img" src="img/' + item.front + '" alt="" loading="lazy">' +
			'</div>' +
			'<span class="ep-card-label">' + item.label + '</span>' +
			'</button>' +
			'</li>';
	}).join('');
}

function buildViewButtons(item) {
	var views = [];
	if (item.front) views.push({ key: 'front', label: 'Front' });
	if (item.back) views.push({ key: 'back', label: 'Back' });
	if (item.inside) views.push({ key: 'inside', label: 'Inside' });

	if (views.length <= 1) {
		_modalViews.innerHTML = '';
		return;
	}

	_modalViews.innerHTML = views.map(function (v) {
		var isActive = v.key === _activeSide;
		return '<button class="lb-strip-item' + (isActive ? ' is-active' : '') + '" data-side="' + v.key + '"' +
			(isActive ? ' aria-current="true"' : '') + '>' + v.label + '</button>';
	}).join('');
}

function updateViewButtons() {
	_modalViews.querySelectorAll('.lb-strip-item').forEach(function (btn) {
		var isActive = btn.getAttribute('data-side') === _activeSide;
		btn.classList.toggle('is-active', isActive);
		if (isActive) {
			btn.setAttribute('aria-current', 'true');
		} else {
			btn.removeAttribute('aria-current');
		}
	});
}

function flipTo(side) {
	if (_isFlipping || side === _activeSide || !_activeItem || !_activeItem[side]) return;

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (reduceMotion) {
		_activeSide = side;
		_modalImg.src = 'img/' + _activeItem[side];
		_modalImg.alt = _activeItem.label + ' — ' + side;
		updateViewButtons();
		return;
	}

	_isFlipping = true;

	_modalInner.style.transition = 'transform 0.22s ease-in';
	_modalInner.style.transform = 'rotateY(90deg)';

	setTimeout(function () {
		_activeSide = side;
		_modalImg.src = 'img/' + _activeItem[side];
		_modalImg.alt = _activeItem.label + ' — ' + side;
		updateViewButtons();

		_modalInner.style.transition = 'none';
		_modalInner.style.transform = 'rotateY(-90deg)';

		_modalInner.getBoundingClientRect();

		_modalInner.style.transition = 'transform 0.22s ease-out';
		_modalInner.style.transform = 'rotateY(0deg)';

		setTimeout(function () {
			_isFlipping = false;
		}, 220);
	}, 220);
}

function openModal(item, sourceEl) {
	_activeItem = item;
	_activeSide = 'front';
	_sourceCard = sourceEl || null;

	_modalImg.src = 'img/' + item.front;
	_modalImg.alt = item.label + ' — front';
	_modalTitle.textContent = item.label;
	_modalCaption.textContent = item.caption || '';

	_modalInner.style.transition = 'none';
	_modalInner.style.transform = 'rotateY(0deg)';

	buildViewButtons(item);

	_modal.classList.add('is-open');
	_modal.removeAttribute('aria-hidden');
	document.body.style.overflow = 'hidden';

	setTimeout(function () {
		_modalClose.focus();
	}, 50);
}

function closeModal() {
	_modal.classList.remove('is-open');
	_modal.setAttribute('aria-hidden', 'true');
	document.body.style.overflow = '';

	var returning = _sourceCard;
	_activeItem = null;
	_sourceCard = null;

	if (returning) returning.focus({ preventScroll: true });
}

_grid.addEventListener('click', function (e) {
	var btn = e.target.closest('.ep-card[data-id]');
	if (!btn) return;
	var item = findItem(btn.getAttribute('data-id'));
	if (item) openModal(item, btn);
});

_modalViews.addEventListener('click', function (e) {
	var btn = e.target.closest('[data-side]');
	if (!btn) return;
	flipTo(btn.getAttribute('data-side'));
});

_modalClose.addEventListener('click', closeModal);

_modal.addEventListener('click', function (e) {
	var keep = [_modalImg, _modalInfo, _modalViews, _modalClose];
	if (!keep.some(function (el) { return el.contains(e.target); })) closeModal();
});

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && _modal.classList.contains('is-open')) closeModal();
});

buildGrid();

new Swiper('#ephemera-swiper', {
	slidesPerView: 'auto',
	centeredSlides: true,
	loop: true,
	spaceBetween: 96,
	grabCursor: true,
	keyboard: { enabled: true },
	navigation: {
		nextEl: '.ep-swiper-next',
		prevEl: '.ep-swiper-prev',
	},
	a11y: {
		prevSlideMessage: 'Previous item',
		nextSlideMessage: 'Next item',
	},
	breakpoints: {
		820: {
			spaceBetween: 128,
		}
	}
});
