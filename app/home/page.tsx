import Appbar from "@/components/blocks/Appbar";
import BetterThemeToggle from "@/components/blocks/BetterThemeToggle";

export default function Home() {
	return (
		<main>
			<Appbar />
			<div className="px-4 font-medium grid">
				Theme
				<BetterThemeToggle />
			</div>
		</main>
	);
}
