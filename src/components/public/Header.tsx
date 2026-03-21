import { getSession } from "@/lib/session";
import HeaderClient from "./HeaderClient";

export default async function Header() {
    const session = await getSession("USER");

    return (
        <HeaderClient session={session} />
    );
}
