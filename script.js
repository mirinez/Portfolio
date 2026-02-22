/*
	script.js (GitHub heatmap only)
	- Generates a decorative "GitHub-ish" heatmap inside #heatmap.
	- No APIs, no real GitHub data: purely visual.
	- JS sets grid-template-columns so the heatmap stretches to the container width.
*/

(() => {
	/* =========================
	   Helpers
	   ========================= */

	const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

	// Simple debounce so resize doesn't spam re-render
	const debounce = (fn, delay = 120) => {
		let t;
		return (...args) => {
			clearTimeout(t);
			t = setTimeout(() => fn(...args), delay);
		};
	};

	/* =========================
	   Heatmap renderer
	   ========================= */

	const renderHeatmap = () => {
		const heatmap = document.getElementById("heatmap");
		if (!heatmap) return;

		// Read computed sizes (cell + gap) so CSS controls the look
		const cellSize = 10; // must match .cell width/height
		const gap = 4;       // must match .heatmap gap

		// IMPORTANT: ensure the container has a measurable width
		const width = heatmap.clientWidth;

		// If width is 0, layout isn't ready yet; try next frame
		if (!width) {
			requestAnimationFrame(renderHeatmap);
			return;
		}

		/*
			Compute how many columns fit:
			cols * cellSize + (cols - 1) * gap <= width
		*/
		const cols = Math.max(1, Math.floor((width + gap) / (cellSize + gap)));

		// Choose a stable number of rows (stylized)
		const rows = 8;
		const total = cols * rows;

		// Apply columns to CSS grid (this is what prevents the 1-column bug)
		heatmap.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;

		// Clear cells before re-rendering
		heatmap.innerHTML = "";

		// Deterministic pseudo-random generator (stable pattern)
		let seed = 1337;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};

		/*
			Fade logic:
			- Left side: more visible.
			- Right side: gradually fades the fill (but squares remain).
			- This creates the "disappearing fill" effect you wanted.
		*/
		for (let i = 0; i < total; i++) {
			const cell = document.createElement("span");
			cell.className = "cell";

			const col = i % cols;
			const x = col / Math.max(1, cols - 1); // 0..1
			const noise = rand();

			// Base intensity (GitHub-ish: mostly light)
			let a = 0.14 + 0.30 * (noise - 0.5);

			// Slight structure (subtle rhythm)
			a += 0.12 * Math.sin(x * Math.PI * 1.2);

			// Fade to the right (this makes the fill disappear gradually)
			const fade = 1 - Math.pow(x, 1.6); // strong fade near the far right
			a *= clamp(fade, 0.10, 1);

			// Keep within safe bounds
			a = clamp(a, 0.05, 0.55);

			// Some sparse near-empty cells for texture
			if (noise < 0.06) a = 0.05;

			cell.style.setProperty("--a", a.toFixed(2));
			heatmap.appendChild(cell);
		}
	};

	/* =========================
	   Init + responsive updates
	   ========================= */

	const safeInit = () => {
		// Wait a frame so layout widths are correct (prevents cols=1 bug)
		requestAnimationFrame(renderHeatmap);
	};

	// Run when DOM is ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", safeInit);
	} else {
		safeInit();
	}

	// Re-render on resize (debounced)
	window.addEventListener("resize", debounce(renderHeatmap, 140));
})();
