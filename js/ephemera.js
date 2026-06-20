var ephemeraItems = [
	{
		id: 'lexia-to-perplexia-book',
		label: 'Lexia to Perplexia',
		front: 'lexia-to-perplexia-front.png',
		back: 'lexia-to-perplexia-back.png'
	},
	{
		id: 'hyper-text-card',
		label: 'Hyper Text Card',
		front: 'hyper_text_card-front.png',
		back: 'hyper_text_card-back.png'
	},
	{
		id: 'cyberarts-festival-card',
		label: 'Boston Cyberarts Festival Card',
		front: 'cyberarts-festival-card-front.png',
		back: 'cyberarts-festival-card-back.png'
	},
	{
		id: 'future-of-elit-card',
		label: 'Future of E-Lit Card',
		front: 'future-of-elit-card.png'
	},
	{
		id: 'hammer-museum',
		label: 'Hammer Museum',
		front: 'hammer-museum-booket-front.png',
		back: 'hammer-museum-booklet-back.png'
	},
	{
		id: 'elo-booklet',
		label: 'ELO Booklet',
		front: 'elo-booklet-front.png',
		back: 'elo-booklet-back.png',
		inside: 'elo-booklet-inside.png'
	},
	{
		id: 'elo-2001-awards-booklet',
		label: 'ELO 2001 Awards Booklet',
		front: 'elo-2001-awards-booklet.png',
		back: 'elo-2001-awards-booklet-back.png'
	},
	{
		id: 'boston-cyberarts-booklet',
		label: 'Boston Cyberarts Festival Program',
		front: 'boston-cyberarts-festival-front.png',
		back: 'boston-cyberarts-festival-back.png',
		inside: 'boston-cyberarts-festival-inside.png'
	},
	{
		id: 'elo-2001-awards-poster',
		label: 'ELO 2001 Awards Poster',
		front: 'elo-2001-awards-poster.png'
	},
	{
		id: 'gig',
		label: 'Gig',
		front: 'gig-2.png'
	},
	{
		id: 'elc',
		label: 'ELC',
		front: 'elc-1.png'
	}
];

var _grid = document.getElementById('ephemera-grid');
var _modal = document.getElementById('ep-modal');
var _modalInner = document.getElementById('ep-modal-inner');
var _modalImg = document.getElementById('ep-modal-img');
var _modalInfo = document.getElementById('ep-modal-info');
var _modalTitle = document.getElementById('ep-modal-title');
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
