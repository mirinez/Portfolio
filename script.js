/*
	script.js
	- Generates a deterministic "GitHub-ish" heatmap inside #heatmap (no external APIs).
	- Adds a simple "copy to clipboard" behavior for any button with [data-copy].
	- Includes optional <dialog> menu logic (safe to keep even if the dialog isn't in the HTML).
	  If you don't have a menu dialog, nothing breaks because everything is null-checked.
*/

(() => {
	/* =========================
	   Optional: Menu dialog controls
	   =========================
	   This project originally supported a <dialog> menu.
	   Your current HTML may not include it, and that's fine:
	   the code below uses optional chaining and will simply do nothing.
	*/
	const dialog = document.getElementById("menuDialog");
	const openBtn = document.querySelector(".menu-btn");
	const closeBtn = dialog?.querySelector("[data-close]");

	const setExpanded = (value) => {
		if (!openBtn) return;
		openBtn.setAttribute("aria-expanded", String(value));
	};

	openBtn?.addEventListener("click", () => {
		if (!dialog) return;
		dialog.showModal();
		setExpanded(true);
	});

	closeBtn?.addEventListener("click", () => {
		dialog?.close();
		setExpanded(false);
	});

	// Close dialog when clicking on the backdrop (outside the inner content)
	dialog?.addEventListener("click", (e) => {
		const rect = dialog.getBoundingClientRect();
		const clickedInside =
			e.clientX >= rect.left &&
			e.clientX <= rect.right &&
			e.clientY >= rect.top &&
			e.clientY <= rect.bottom;

		// If click is outside the dialog box area, close it
		if (!clickedInside) {
			dialog.close();
			setExpanded(false);
		}
	});

	dialog?.addEventListener("close", () => setExpanded(false));

	// Optional smooth scroll for menu links (anchors with [data-nav])
	dialog?.querySelectorAll("[data-nav]")?.forEach((a) => {
		a.addEventListener("click", (e) => {
			const href = a.getAttribute("href");
			if (!href || !href.startsWith("#")) return;

			e.preventDefault();
			dialog.close();
			setExpanded(false);

			document.querySelector(href)?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		});
	});

	/* =========================
	   GitHub-ish heatmap generator
	   =========================
	   The heatmap is purely decorative: we generate a fixed-looking grid
	   so the portfolio feels "alive" without calling GitHub APIs.
	*/
	const heatmap = document.getElementById("heatmap");

	if (heatmap) {
		// Clear existing cells (useful if script runs twice in dev)
		heatmap.innerHTML = "";

		const cols = 42;  // weeks
		const rows = 8;   // days-ish (stylized; not exact GitHub calendar)
		const total = cols * rows;

		// Deterministic pseudo-random generator
		// (so it looks designed and doesn't change on every refresh)
		let seed = 1337;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};

		for (let i = 0; i < total; i++) {
			const cell = document.createElement("span");
			cell.className = "cell";

			// Shape intensity so the right side is slightly stronger
			const col = i % cols;
			const bias = col / (cols - 1); // 0..1
			const noise = rand();

			// Mostly light, occasional medium, a few stronger toward the right edge
			let a = 0.10 + 0.38 * Math.pow(bias, 1.7) + 0.18 * (noise - 0.5);
			a = Math.max(0.08, Math.min(0.75, a));

			// Sparsify slightly (some near-empty cells)
			if (noise < 0.07) a = 0.05;

			// CSS uses rgba(..., var(--a)) to set intensity
			cell.style.setProperty("--a", a.toFixed(2));
			heatmap.appendChild(cell);
		}
	}

	/* =========================
	   Copy to clipboard (email)
	   =========================
	   Any button with [data-copy="..."] will copy that value on click.
	   Uses modern Clipboard API with a fallback for older browsers.
	*/
	document.querySelectorAll("[data-copy]").forEach((btn) => {
		btn.addEventListener("click", async () => {
			const value = btn.getAttribute("data-copy") || "";
			if (!value) return;

			const oldLabel = btn.textContent;

			try {
				await navigator.clipboard.writeText(value);
				btn.textContent = "Copied";
				setTimeout(() => (btn.textContent = oldLabel), 900);
			} catch {
				// Fallback: temporary textarea selection
				const ta = document.createElement("textarea");
				ta.value = value;
				ta.setAttribute("readonly", "");
				ta.style.position = "absolute";
				ta.style.left = "-9999px";

				document.body.appendChild(ta);
				ta.select();
				document.execCommand("copy");
				document.body.removeChild(ta);

				btn.textContent = "Copied";
				setTimeout(() => (btn.textContent = oldLabel), 900);
			}
		});
	});
})();
