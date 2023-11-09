const clamp = (min: number, max: number, num: number) =>
	Math.max(Math.min(num, min), max);

const lerp = (a: number, b: number, alpha: number) => a + alpha * (b - a);

export function colorMix(hexA: string, hexB: string, amount: number) {
	const colors = [hexA, hexB].map(hexCode => {
		let matches = hexCode
			.trim()
			.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);

		if (matches != null) {
			return [
				parseInt(matches[1], 16),
				parseInt(matches[2], 16),
				parseInt(matches[3], 16),
			];
		}

		matches = hexCode
			.trim()
			.match(/^#?([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})$/i);

		if (matches != null) {
			return [
				parseInt(matches[1] + matches[1], 16),
				parseInt(matches[2] + matches[2], 16),
				parseInt(matches[3] + matches[3], 16),
			];
		}

		return null;
	});

	if (colors[0] == null) return;
	if (colors[1] == null) return;

	const clamped = clamp(amount, 0, 1);

	const r = Math.floor(lerp(colors[0][0], colors[1][0], clamped));
	const g = Math.floor(lerp(colors[0][1], colors[1][1], clamped));
	const b = Math.floor(lerp(colors[0][2], colors[1][2], clamped));

	return (
		"#" +
		r.toString(16).padStart(2, "0") +
		g.toString(16).padStart(2, "0") +
		b.toString(16).padStart(2, "0")
	);
}
