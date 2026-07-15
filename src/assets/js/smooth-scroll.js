/**
 * Cute, eased in-page scrolling for the single-page site.
 * Intercepts same-page anchor clicks (href="#id") and animates the scroll with
 * an easeInOutQuart curve. The target is recomputed every frame, and re-snapped
 * a few times after landing so lazy-loading images that shift the layout can't
 * leave us short. Any real user scroll input cancels an in-progress scroll.
 */
(() => {
	const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const nav = document.querySelector("#cs-navigation");
	const toggle = document.querySelector("#cs-navigation .cs-toggle");

	// how far below the fixed nav the section should sit. Lower this (even negative)
	// to land further down the page; raise it for more breathing room. ← the knob
	const GAP = -100;

	const easeInOutQuart = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

	const targetTop = (el) =>
		Math.max(0, el.getBoundingClientRect().top + window.scrollY - ((nav ? nav.getBoundingClientRect().height : 0) + GAP));

	let token = 0;

	// a genuine user scroll cancels any programmatic scroll / pending re-snaps
	["wheel", "touchstart", "keydown"].forEach((ev) => window.addEventListener(ev, () => token++, { passive: true }));

	// correct for images that finish loading after we land and push the target down
	const reSnap = (el, myToken) => {
		const snap = () => myToken === token && window.scrollTo(0, targetTop(el));
		setTimeout(snap, 120);
		setTimeout(snap, 350);
		window.addEventListener("load", snap, { once: true });
	};

	const scrollToEl = (el) => {
		const myToken = ++token;
		const startY = window.scrollY;
		const duration = Math.min(1300, Math.max(650, Math.abs(targetTop(el) - startY) * 0.7));
		let startTime = null;

		const step = (now) => {
			if (myToken !== token) return; // superseded by a newer click or user scroll
			if (startTime === null) startTime = now;
			const t = Math.min((now - startTime) / duration, 1);
			window.scrollTo(0, startY + (targetTop(el) - startY) * easeInOutQuart(t));
			if (t < 1) requestAnimationFrame(step);
			else {
				window.scrollTo(0, targetTop(el)); // exact landing
				reSnap(el, myToken);
			}
		};
		requestAnimationFrame(step);
	};

	document.addEventListener("click", (event) => {
		const link = event.target.closest('a[href^="#"], a[href^="/#"]');
		if (!link) return;

		const hash = link.getAttribute("href").replace(/^\//, "");
		if (hash.length < 2) return;

		const target = document.querySelector(hash);
		if (!target) return;

		event.preventDefault();
		if (toggle && nav && nav.classList.contains("cs-active")) toggle.click(); // close mobile menu

		if (prefersReduced) {
			window.scrollTo(0, targetTop(target));
			reSnap(target, ++token);
		} else {
			scrollToEl(target);
		}

		history.pushState(null, "", link.getAttribute("href"));
	});
})();
