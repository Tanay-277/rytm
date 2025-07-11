import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { AudioLines, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function MediaQueue() {
	return (
		<div className="w-1/4 bg-secondary/20 rounded-xl overflow-auto">
			{/* <div className="h-full flex text-muted-foreground">
				Media Queue
			</div> */}
			<Tabs defaultValue="tracks">
				<header className="sticky top-0 p-4 flex items-center justify-between">
					Phantom Space
					<div>
						<TabsList>
							<TabsTrigger value="tracks">
								{" "}
								{/* <Button> */}
								<AudioLines />
								{/* </Button> */}
							</TabsTrigger>
							<TabsTrigger value="users">
								{/* <Button> */}
								<UserRound />
								{/* </Button> */}
							</TabsTrigger>
						</TabsList>
					</div>
				</header>
				<TabsContent value="tracks">
					
				</TabsContent>
				<TabsContent value="users">
					
				</TabsContent>
			</Tabs>
		</div>
	);
}
