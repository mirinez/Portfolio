/*
	script.js
	- Generates a deterministic "GitHub-ish" heatmap inside #heatmap.
	- Purely decorative: no external APIs, no GitHub data, no network requests.
	- Auto-fits the number of columns to reach the right edge of the content column.
	- Applies a subtle fade-out to the right so the fill "disappears" gracefully.
*/

(() => {
	/* =========================
	   GitHub-ish Heatmap Generator
	   ========================= */
	const heatmap = document.getElementById("heatmap");
	if (!heatmap) return;

	// Measure from a stable parent width (split-content), not the heatmap itself
	const content = heatmap.closest(".split-content") || heatmap.parentElement;

	/* Layout knobs (must match CSS sizing) */
	const CELL = 10; // px
	const GAP = 4;   // px
	const rows = 8;  // stylized "days-ish" rows

	/* Deterministic pseudo-random generator (stable pattern) */
	let seed = 1337;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	const computeCols = (width) => {
		// Each column consumes CELL + GAP, last column doesn't need a trailing gap
		return Math.max(1, Math.floor((width + GAP) / (CELL + GAP)));
	};

	const build = () => {
		// Read available width (fallbacks included)
		const w = Math.floor(
			content?.clientWidth ||
			heatmap.parentElement?.clientWidth ||
			heatmap.clientWidth ||
			0
		);

		// If layout isn't ready yet, retry next frame
		if (w < 50) {
			requestAnimationFrame(build);
			return;
		}

		heatmap.innerHTML = "";

		const cols = computeCols(w);
		const total = cols * rows;

		// Set the grid columns dynamically so it fills the width
		heatmap.style.gridTemplateColumns = `repeat(${cols}, ${CELL}px)`;

		for (let i = 0; i < total; i++) {
			const cell = document.createElement("span");
			cell.className = "cell";

			const col = i % cols;
			const bias = col / (cols - 1 || 1); // 0..1
			const noise = rand();

			/*
				Fade-out to the right:
				- Left side feels more present
				- Right side gradually disappears (cells remain)
			*/
			const fade = 1 - bias;

			// Base intensity + gentle randomness
			let a = 0.18 + 0.25 * noise;

			// Apply fade curve (increase exponent for stronger fade)
			a *= Math.pow(fade, 1.8);

			// Clamp intensity range
			a = Math.max(0.04, Math.min(0.6, a));

			cell.style.setProperty("--a", a.toFixed(2));
			heatmap.appendChild(cell);
		}
	};

	// Build after layout settles (two frames improves reliability)
	requestAnimationFrame(() => requestAnimationFrame(() => {
		seed = 1337;
		build();
	}));

	// Rebuild on resize (keep the same stable pattern)
	window.addEventListener("resize", () => {
		seed = 1337;
		build();
	});
})();
