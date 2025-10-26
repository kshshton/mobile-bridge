// app/index.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function IndexScreen() {
    const router = useRouter();

    useEffect(() => {
        // wrap in setTimeout to ensure root layout is mounted
        const timer = setTimeout(() => {
            router.replace("/home");
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
