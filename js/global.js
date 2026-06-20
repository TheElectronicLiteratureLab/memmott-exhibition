function esc(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

(function () {
	var GREEN = 'brightness(0) saturate(100%) invert(67%) sepia(84%) saturate(700%) hue-rotate(74deg) brightness(106%)';
	var SLICE_H = 5, MAX_SHIFT = 20, FRAME_SKIP = 4;

	function setup(img) {
		var w = img.offsetWidth, h = img.offsetHeight;
		if (!w || !h) return;

		var nw = img.naturalWidth || w, nh = img.naturalHeight || h;
		if (!nw || !nh) { nw = w; nh = h; }
		var scale = Math.min(w / nw, h / nh);
		var imgW = nw * scale, imgH = nh * scale;
		var imgX = (w - imgW) / 2, imgY = h - imgH;
		var rows = Math.ceil(h / SLICE_H);
		var displacements = new Array(rows).fill(0);

		var canvas = document.createElement('canvas');
		canvas.width = w; canvas.height = h;
		canvas.style.cssText = 'display:block;width:' + w + 'px;height:' + h + 'px;filter:' + GREEN;
		canvas.setAttribute('aria-hidden', 'true');
		img.insertAdjacentElement('beforebegin', canvas);
		img.style.display = 'none';

		var ctx = canvas.getContext('2d');

		function draw() {
			ctx.clearRect(0, 0, w, h);
			try {
				for (var r = 0; r < rows; r++) {
					var sy = r * SLICE_H, sh = Math.min(SLICE_H, h - sy), dx = displacements[r];
					ctx.save();
					ctx.beginPath();
					ctx.rect(0, sy, w, sh);
					ctx.clip();
					ctx.translate(dx, 0);
					ctx.drawImage(img, imgX, imgY, imgW, imgH);
					ctx.restore();
				}
			} catch (e) {
				canvas.remove();
				img.style.display = '';
			}
		}

		draw();

		var rafId = null, frame = 0;

		function start() {
			if (rafId) return;
			frame = 0;
			rafId = requestAnimationFrame(tick);
		}

		function tick() {
			frame++;
			if (frame % FRAME_SKIP === 0) {
				var n = Math.ceil(Math.random() * 4);
				for (var i = 0; i < n; i++) {
					var r = Math.floor(Math.random() * rows);
					displacements[r] = Math.random() < 0.25 ? 0 : Math.round((Math.random() * 2 - 1) * MAX_SHIFT);
				}
				draw();
			}
			rafId = requestAnimationFrame(tick);
		}

		function stop() {
			cancelAnimationFrame(rafId);
			rafId = null;
			displacements.fill(0);
			draw();
		}

		var card = img.closest('.landing-card');
		card.addEventListener('mouseenter', start);
		card.addEventListener('mouseleave', stop);
	}

	window.addEventListener('load', function () {
		document.querySelectorAll('.landing-icon').forEach(setup);
	});
}());

var descriptions = [
	'Considered "an appendix to \'Lexia to Perplexia,\' deal[ing] with network attachment" (ELMCIP), "Translucidity" is viewed by critic N. Katherine Hayles as a work that "interrogates how interfaces and the machines that process them construct subjectivity." As she points out, the work lays bare the fact that "natural and machine languages mingle in the production of electronic literature." It push[es] toward the creation of a creole comprised of English and code . . . draw[ing] on the literary tradition and programming protocols to ask what it means for contemporary users to be constructed by both. What kinds of subjects are spoken by this creole? What kinds of subjectivities are implied by the interfaces created by these works, and what is their relation to the machines that write them?',
	'"Lexia to Perplexia" is a deconstructive/grammatological examination of the "delivery machine." The text of the work falls into the gaps between theory and fiction. The work makes wide use of DHTML and JavaScript. At times its interactive features override the source text, leading to a fragmentary reading experience. In essence, the text does what it says: in that, certain theoretical attributes are not displayed as text but are incorporated into the functionality of the work. Additionally, "Lexia to Perplexia" explores new terms for the processes and phenomena of attachment. Terms such as "metastrophe" and "intertimacy" work as sparks within the piece and are meant to inspire further thought and exploration.',
	'Talan Memmott\'s remix of "Taroko Gorge" is at first startling to behold, relying on a pastel background of brightly-colored stripes and the infamous Comic Sans delivering poems about Barbies and Raggedy Ann. All of the letters are capitalized, creating a look that is reminiscent of an over-zealous marketing campaign or child-oriented website. This playful look is very different from most of the "Taroko Gorge" aesthetics, and serves as an appropriate aesthetic for a work that creates a virtual playroom of toxic, hazardous, and even destructive toys.',
	'"Reasoned Metagoria" represents an early and conceptually important position in the author\'s body of electronic literature, appearing in broader theoretical discussions of digital poetics and networked textuality. For Memmott, "metagoria" suggests a semiotic condition in which meaning is distributed across networked, procedural, and interface-based structures rather than confined to linear language. In this framework, "Reasoned Metagoria" privileges inference, association, and interaction over narrative continuity.',
	'"LUX: Bronzino 1540" is a "hypermedia work, or ficto-crit[i]cal art history [that] deconstructs, contextualizes and manipulates the Bronzino painting, \'The Exposure of Luxury.\' The painting in its entirety is never viewable in the piece; rather, the contexts, characters, and insinuated actions of the painting are displaced and replaced by other contexts, both relevant and fanciful. From Greek Mythology and French Aristocratic Private Theater (salon) to the work of Bataille, Artaud, Fragonard, Watteau, Balthus, the piece touches upon diverse sources as it strives to produce a frivolous body of erotics."',
	'"Lolli\'s Apartment" is an early web-based hypertext fiction that uses the metaphor of an apartment space to explore fragmented subjectivity, mediated intimacy, and the instability of narrative in digital environments. It presents an apartment the reader experiences via mouse movement and interactive rollovers. Rooms, objects, and surfaces reveal textual fragments when explored. The apartment also functions as a conceptual architecture — a spatialized interface in which narrative emerges through traversal rather than linear progression.',
	'"This story is dedicated to no-one, least of all the muse — this text belongs to no-body. Speaking as not the author but the hero — I would hope to venomize the versified. I would hope to produce anxiety throughout the body of this Fury, Hope — a fear of illiterature (language shrunken to mere lexicon, or scattered vernacular...) (what will be written about, against...) (the subject consumes itself...). In this rat infested Pantheon I have seen the hash-cognac transformation of all poetry, the sleepwalking Dystopia and heavy-handed boredom."',
	'Produced in the period he created Translucidity and Lexia to Perplexia, "Delimited Meshings" continues with Memmott\'s exploration of the conditions of textuality inside a computational system, specifically at how meaning is produced when language is entangled with code, interface behavior, and user interaction. The "meshings" of the title refer to these interlacings: textual fragments mesh with interface mechanics; reader actions mesh with programmed responses; semantic meaning meshes with visual and procedural effects.',
	'"Minute" is a brief, deliberately paced piece of early web-based electronic literature that foregrounds the passage of time as its primary aesthetic and conceptual concern. It unfolds over approximately one minute of interaction, during which words and micro-textual fragments animate the screen and respond to temporal progression in ways that make the experience itself the subject. The web interface is not simply a delivery mechanism but an active component of the piece: text elements appear, collide, and fade almost as if caught in an environment governed by duration rather than by narrative sequence.',
	'"Trimalchio\'s Diet" draws its conceptual frame from the figure of Trimalchio in Petronius\' satire, Satyricon. He is a grotesquely wealthy freedman whose excesses are staged through elaborate banquets. Memmott reinterprets this classical satire within a digital environment, transforming the notion of "diet" into a meditation on consumption, excess, and mediated appetite in network culture. Language is presented as something ingested and processed; the interface itself becomes a site of consumption.',
	'"Self Portrait(s) [as Other(s)]" is a recombinant portrait and biography generator. The piece recombines the self-portraits of a dozen well-known painters as well as biographical text on each. Accordingly, the generated pictorial and textual portraits are no longer self portraits, but "selves" portraits, with subjects that are more than one. The piece deals with identity in an art-historical context, self-identity for any given artist, and identification as a process. There are over 120,000,000 possible recombinations.',
	'An early example of web-based literary playfulness and intertextual experimentation emerging in the late 1990s, Bread.Crumbs opens with a self-conscious declaration that it riffs on a fictional "scratch novel" titled CRACKED EGGS AND WASTED TIME. The introduction signals the work\'s literary ambition while simultaneously undermining traditional narrative expectations: it claims roots in misreadings of D. H. Lawrence\'s Women in Love alongside The Egyptian Book of the Dead, then commingles these allusions with "additional nonsense."',
	'A "recyclopedic" generator of "contextually resistant associations," "Dérivepedia" is a combinatory and recyclopedic text generator that recombines sentence fragments from 400 Wikipedia entries to generate specious entries for subjects ranging from Tadpoles And The History Of Weather Satellites To Pliny The Elder: Constructing Ambiguous Witch Trials; from Jimi Hendrix And The Psychology Of Cowpox To Ada Lovelace In The Age Of Cool-Weather Aromatherapy.'
];

function shuffled(arr) {
	var a = arr.slice();
	for (var i = a.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
	}
	return a;
}

function populateBgText() {
	var pool = shuffled(descriptions);
	[0, 1, 2].forEach(function (col) {
		var el = document.getElementById('bg-col-' + col);
		if (el && pool[col]) {
			el.innerHTML = '';
			var p = document.createElement('p');
			p.textContent = pool[col];
			el.appendChild(p);
		}
	});
}

populateBgText();
setInterval(populateBgText, 9000);

(function () {
	var eyeBtn = document.getElementById('eye-btn');
	if (!eyeBtn) return;
	var eyeLine = document.getElementById('eye-line');
	var lineOpen = false;

	function getEyeCenter() {
		var rect = eyeBtn.getBoundingClientRect();
		return {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2
		};
	}

	var _eyeResizeTimer;
	window.addEventListener('resize', function () {
		if (!lineOpen) return;
		clearTimeout(_eyeResizeTimer);
		_eyeResizeTimer = setTimeout(function () {
			var c = getEyeCenter();
			eyeLine.style.top = (c.y - 4) + 'px';
			eyeLine.style.right = (window.innerWidth - c.x + 6) + 'px';
		}, 100);
	});

	eyeBtn.addEventListener('click', function () {
		var c = getEyeCenter();

		eyeLine.style.top = (c.y - 4) + 'px';
		eyeLine.style.left = '0';
		eyeLine.style.right = (window.innerWidth - c.x + 6) + 'px';

		if (!lineOpen) {
			lineOpen = true;
			eyeBtn.setAttribute('aria-pressed', 'true');
			gsap.set(eyeLine, { scaleX: 0, transformOrigin: 'right center', display: 'block' });
			gsap.to(eyeLine, { scaleX: 1, duration: 0.65, ease: 'power3.out' });
		} else {
			lineOpen = false;
			eyeBtn.setAttribute('aria-pressed', 'false');
			gsap.to(eyeLine, {
				scaleX: 0,
				transformOrigin: 'right center',
				duration: 0.45,
				ease: 'power3.in',
				onComplete: function () { gsap.set(eyeLine, { display: 'none' }); }
			});
		}
	});
}());

(function () {
	var toggle = document.getElementById('nav-toggle');
	var nav = document.getElementById('site-nav');
	if (!toggle || !nav) return;

	var closeBtn = document.getElementById('site-nav-close');

	function openNav() {
		nav.classList.add('is-open');
		toggle.setAttribute('aria-expanded', 'true');
		document.body.style.overflow = 'hidden';
	}

	function closeNav() {
		nav.classList.remove('is-open');
		toggle.setAttribute('aria-expanded', 'false');
		document.body.style.overflow = '';
		toggle.focus();
	}

	toggle.addEventListener('click', function () {
		nav.classList.contains('is-open') ? closeNav() : openNav();
	});

	if (closeBtn) closeBtn.addEventListener('click', closeNav);

	nav.addEventListener('click', function (e) {
		if (e.target === nav) closeNav();
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
	});
}());
